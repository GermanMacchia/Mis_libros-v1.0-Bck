'use strict'

// Pedidos de paquetes ------------------------------------------
const express = require('express');
const jwt = require('jsonwebtoken');
const unless = require('express-unless');
const bcrypt = require('bcrypt');
const cors = require('cors');
const categoriaController = require('../controllers/categoriaController.js');
const personaController = require('../controllers/personaController.js');
const libroController = require('../controllers/libroController.js');
const usuarioController = require('../controllers/usuarioController.js');
const trim = require('./funcionConEspacios.js');
// Declaración del paquete express en aplicación-----------------
const app = express();

// Llamada del middleware especifico del paquete-----------------
app.use(express.json()); //permite el mapeo de la peticion json a object js 
app.use(express.static('public')); // permite uso de la carpeta con el nombre expresado
app.use(cors());

// Establecer puerto  -------------------------------------------
const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => {
    console.log('Aplicación operativa.\nEscuchando el puerto ' + port)
});

// Autenticación (Middleware) ----------------------------------------
const auth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, 'Secret', (err, decoded) => {
            if (err) {
                return res.send({
                    mensaje: 'Token inválida'
                });
            } else {
                next();
            }
        });
    } else {
        res.send({
            mensaje: 'Token no proveída.'
        });
    }
};

// Unless ---------------------------------------------------
auth.unless = unless;
app.use(auth.unless({
    path: [{
        url: '/login',
        methods: ['POST']
    }, {
        url: '/registro',
        methods: ['POST']
    }]
}));

//funcion para evitar campos vacios --------------------------

// 1. Registración <<<<<<<<<<<<<<<<<< 
app.post('/registro', async(req, res) => {
    try {
        if (!req.body.usuario || !req.body.clave || !req.body.email || !req.body.celu) {
            throw new Error('No enviaste todos los datos necesarios');
        }
        let email = req.body.email.toUpperCase();
        let usuario = req.body.usuario;
        let celu = req.body.celu;
        //VERIFICACIÓN
        let respuesta = await usuarioController.nombreUsuario(usuario);
        if (respuesta.length > 0) {
            throw new Error('Nombre de Usuario existente')
        }
        //ENCRIPTACIÓN DE CLAVE
        const claveEncriptada = await bcrypt.hash(req.body.clave, 10);
        //GUARDAR USUARIO NUEVO
        respuesta = await usuarioController.guardarUsuario([usuario, claveEncriptada, email, celu]);
        res.send({ message: "Se registro correctamente" });
    } catch (e) {
        res.status(414).send({ message: e.nessage });
    }
});

// 2. Login        <<<<<<<<<<<<<<<<<< 

app.post('/login', async(req, res) => {
    try {
        if (!req.body.user || !req.body.pass) {
            res.send({
                error: 'No mandaste todos los datos'
            })
            return;
        }
        // VERIFICO USUARIO *************
        let respuesta = await usuarioController.nombreUsuario(req.body.user);
        if (respuesta.length == 0) { // Si no me arroja ningun resultado entonces el query esta vacio
            throw new Error('El nombre de usuario no esta registrado')
        }
        // VERIFICO CLAVE ***************
        respuesta = await usuarioController.claveUsuario(req.body.user);
        let passverify = bcrypt.compareSync(req.body.pass, respuesta[0].clave_encriptada)
        if (passverify == false) {
            throw new Error('Contraseña incorrecta')
        };
        //INICIO SESION *********************
        let email = await usuarioController.emailUsuario(req.body.user);
        let id = await usuarioController.idUsuario(req.body.user);
        const tokenData = {
            nombre: req.body.user,
            email: email,
            user_id: id
        }
        const token = jwt.sign(tokenData, 'Secret', { // Se utiliza una palabra determinada para codificar el token
            expiresIn: 60 * 60 * 24 // en este caso, expira en 24hs
        })
        res.send({
            token
        });
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: e.message
        })
    }
});

// Desarrollo de la lógica en la API //////////////////////////////////


// CATEGORIA --------------------------------------------------------


/* 1 - Post <<<<<<<<<<<<<<<<<< 

Categoria recibe: {nombre:sting} retorna status 200{id: numerico, nombre:string} - 
status 413, {mensaje: <descripcion del error> que puede ser:
"faltan datos", "ese nombre de categoria ya existe", "error inesperado" **/

app.post('/categoria', async(req, res) => {

    try {
        //VALIDACIÓN
        if (!req.body.nombre_categoria) {
            throw new Error('Falta enviar el nombre');
        }
        if (await trim.conEspacios(req.body.nombre_categoria)) {
			throw new Error('Los campos requeridos no pueden permanecer con espacios vacios');
			//Si no hay contenido en JSON "nombre" en el body tira error
		}
        //STANDARIZACIÓN
        let nombre = req.body.nombre_categoria.toUpperCase();
        //VERIFICACIÓN
        let verificacion = await categoriaController.verificarCategoria(nombre)
        if (verificacion.length > 0) {
            throw new Error('Categoria Existente');
        }
        //INSERCIÓN
        let nuevaCategoria = await categoriaController.postCategoria(nombre);
        res.status(200).send({
            nuevaCategoria
        });
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 2 - Get CATEGORIA <<<<<<<<<<<<<<<<<<

'/categoria' retorna: status 200  y [{id:numerico, nombre:string}]  
- status: 413 y [] */

app.get('/categoria', async(req, res) => {
    try {
        let respuesta = await categoriaController.verCategorias();
        res.status(200).send({
            respuesta // Devuelve JSON 
        });
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 3 - Get ID <<<<<<<<<<<<<<<<<<

'/categoria/:id' retorna: status 200 y {id: numerico, nombre:string} - 
status: 413, {mensaje: <descripcion del error>} que puede 
ser: "error inesperado", "categoria no encontrada" */

app.get('/categoria/:id', async(req, res) => {
    try {
        let id = req.params.id;
        let respuesta = await categoriaController.verCategoriaId(id);
        res.status(200).send({
            respuesta
        });
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: 'Error inesperado'
        });
    }
});

/* 4 - Delete <<<<<<<<<<<<<<<<<<

'/categoria/:id' retorna: status 200 y {mensaje: "se borro correctamente"} 
- status: 413, {mensaje: <descripcion del error>} que puese ser: "error inesperado", 
"categoria con libros asociados, no se puede eliminar", "no existe la categoria 
indicada" */

app.delete('/categoria/:id', async(req, res) => {
    try {
        //VERIFICACIÓN
        let id = req.params.id;
        let respuesta = await categoriaController.verificarCategoriaID(id);
        if (respuesta.length == 0) {
            throw new Error("Esta categoria no existe");
        }
        //CHEQUEO DE LIBROS ASOCIADOS
        respuesta = await categoriaController.chequeoLibrosCategoria(id);
        if (respuesta.length > 0) {
            throw new Error("Esta categoria tiene libros asociados, no se puede eliminar");
        }
        //BORRAR CATEGORIA
        respuesta = await categoriaController.borrarCategoria(id)
        console.log(respuesta)
        res.status(200).send({
            respuesta: 'Se borro correctamente la categoria'
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});


//PERSONA----------------------------------------------------------

/* 5 - Post <<<<<<<<<<<<<<<<<<

'/persona' recibe: {nombre: string, apellido: string, alias: string, 
email: string} retorna: status: 200, {id: numerico, nombre: string, 
apellido: string, alias: string, email: string} - status: 413, 
{mensaje: <descripcion del error>} que puede ser: "faltan datos", 
"el email ya se encuentra registrado", "error inesperado" */

app.post('/persona', async(req, res) => {
    try {
        //VALIDACIÓN
        if (!req.body.email_persona || !req.body.apellido_persona || !req.body.nombre_persona) {
            throw new Error('Faltan datos'); // alias permite null
        }
        if (await trim.conEspacios(req.body.email_persona)||
        	await trim.conEspacios(req.body.apellido_persona)||
        	await trim.conEspacios(req.body.nombre_persona)) {
			throw new Error('Los campos requeridos no pueden permanecer con espacios vacios');
		}
        //STANDARIZACIÓN
        const email = req.body.email_persona.toUpperCase();
        const apellido = req.body.apellido_persona.toUpperCase();
        const nombre = req.body.nombre_persona.toUpperCase();
        const alias = req.body.alias_persona.toUpperCase();
        //VERIFICACIÓN
        let respuesta = await personaController.verificarPersona(email);
        if (respuesta.length > 0) {
            throw new Error('El email ya se encuentra registrado')
        }
        //GUARDAR
        respuesta = await personaController.guardarPersona([nombre, apellido, email, alias]);
        res.status(200).send({
            Id: respuesta.insertId,
            Nombre: nombre,
            Apellido: apellido,
            Email: email,
            Alias: alias
        });
    } catch (e) {
        // statements
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 6 - Get <<<<<<<<<<<<<<<<<< 

'/persona' retorna status 200 y [{id: numerico, nombre: string, apellido: 
string, alias: string, email; string}] o bien status 413 y [] */

app.get('/persona', async(req, res) => {
    try {
        let respuesta = await personaController.verPersonas();
        res.status(200).send({
            respuesta: respuesta
        });
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});


/* 7 - Get ID <<<<<<<<<<<<<<<<<<

'/persona/:id' retorna status 200 y {id: numerico, nombre: string, 
apellido: string, alias: string, email; string} - status 413,
 {mensaje: <descripcion del error>} "error inesperado", 
 "no se encuentra esa persona" */

app.get('/persona/:id', async(req, res) => {
    try {
        let id = req.params.id;
        let respuesta = await personaController.verPersonaId(id);
        if (respuesta.length == 0) {
            throw new Error('No se encuentra esa persona');
        }
        res.status(200).send({
            respuesta: respuesta
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 8 - Put ID <<<<<<<<<<<<<<<<<<

'/persona/:id' recibe: {nombre: string, apellido: string, alias: string, 
email: string} el email no se puede modificar. 
retorna status 200 y el objeto modificado o bien status 413, 
{mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa 
persona" */

app.put('/persona/:id', async(req, res) => {
    try {
        let id = req.params.id;
        if (await trim.conEspacios(req.body.email_persona)||
        	await trim.conEspacios(req.body.apellido_persona)||
        	await trim.conEspacios(req.body.nombre_persona)) {
			throw new Error('Los campos requeridos no pueden permanecer vacios');
		}
        //STANDARIZACIÓN
        let email = req.body.email_persona.toUpperCase();
        let apellido = req.body.apellido_persona.toUpperCase();
        let nombre = req.body.nombre_persona.toUpperCase();
        let alias = req.body.alias_persona.toUpperCase();
        //VERIFICACIÓN
        let respuesta = await personaController.verificacionDoble([email, id]);
        if (respuesta.length < 1) {
            throw new Error('El email no se puede modificar');
        }
        //INSERCIÓN
        respuesta = await personaController.actualizarPersona([nombre, apellido, alias, id]);
        res.status(200).send({
            respuesta: 'La persona se ha modificado con exito'
        })
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 9 - Delete ID <<<<<<<<<<<<<<<<<<
'/persona/:id' retorna: 200 y {mensaje: "se borro correctamente"} o 
bien 413, {mensaje: <descripcion del error>} "error 
inesperado", "no existe esa persona", "esa persona tiene libros asociados, 
no se puede eliminar" */

app.delete("/persona/:id", async(req, res) => {
    try {
        //VERIFICACIÓN
        let id = req.params.id;
        let respuesta = await personaController.verPersonaId(id);
        if (respuesta.length == 0) {
            throw new Error("Esta persona no se encuentra registrada");
        }
        //CHEQUEO EN LIBROS **********
        respuesta = await personaController.chequeoLibrosPersona(id);
        if (respuesta.length > 0) {
            throw new Error(
                "Esta persona tiene libros asociados, no se puede eliminar"
            );
        }
        //BORRAR
        respuesta = await personaController.borrarPersona(id);
        res.status(200).send({
            respuesta: "Se borro correctamente",
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

//LIBRO----------------------------------------------------------

/* 10 - Post  <<<<<<<<<<<<<<<<<<

'/libro' recibe: {nombre:string, descripcion:string, categoria_id:numero, 
persona_id:numero/null} devuelve 200 y {id: numero, nombre:string, 
descripcion:string, categoria_id:numero, persona_id:numero/null} o bien 
status 413,  {mensaje: <descripcion del error>} que puede ser 
"error inesperado", "ese libro ya existe", "nombre y categoria son datos 
obligatorios", "no existe la categoria indicada", "no existe la persona indicada"*/

app.post('/libro', async(req, res) => {
    try {
        //Validación de envio correcto de informacion
        if (!req.body.nombre_libro || !req.body.descripcion_libro || !req.body.id_categoria) {
            throw new Error('Nombre y Categoría son datos obligatorios');
        }
        if (await trim.conEspacios(req.body.nombre_libro)||
        	await trim.conEspacios(req.body.descripcion_libro)||
        	await trim.conEspacios(req.body.id_categoria)) {
			throw new Error('Los campos requeridos no pueden permanecer vacios');
		}
        //STANDARIZACIÓN 
        let nombre = req.body.nombre_libro.toUpperCase();
        let idCategoria = req.body.id_categoria;
        let descripcion = req.body.descripcion_libro;
        //VERIFICACIÓN NOMBRE
        let respuesta = await libroController.verificarLibro(nombre);
        if (respuesta.length > 0) {
            throw new Error('Ese libro ya existe')
        }
        //VERIFICACIÓN CATEGORIA
        respuesta = await categoriaController.verificarCategoriaID(idCategoria);
        if (respuesta.length == 0) {
            throw new Error('No existe la categoria indicada')
        }
        //INSERCION
        respuesta = await libroController.guardarLibro([nombre, descripcion, idCategoria]);
        console.log(respuesta);
        res.status(200).send({
            Nombre: nombre,
            Descripcion: descripcion,
            Categoria: idCategoria,
            id_libro: respuesta.insertId
        });
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 11 - Get <<<<<<<<<<<<<<<<<<

GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, 
categoria_id:numero, persona_id:numero/null}] o bien 413,
{mensaje: <descripcion del error>} "error inesperado" */

app.get('/libro', async(req, res) => {
    try {
        const respuesta = await libroController.verLibros();
        res.status(200).send({
            respuesta: respuesta
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });

    }
});

/* 12 - Get ID <<<<<<<<<<<<<<<<<<<

GET '/libro/:id' devuelve 200 {id: numero, nombre:string, descripcion:string, 
categoria_id:numero, persona_id:numero/null} y status 413, {mensaje: 
<descripcion del error>} "error inesperado", "no se encuentra ese libro" */

app.get('/libro/:id', async(req, res) => {
    try {
        let respuesta = await libroController.verificarLibroId(req.params.id);

        if (respuesta.length == 0) {
            throw new Error('No se encuentra ese libro');
        }
        res.status(200).send({
            respuesta: respuesta
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 13 - Put ID <<<<<<<<<<<<<<<<<<<

'/libro/:id' y {id: numero, nombre:string, descripcion:string, categoria_id:numero,
 persona_id:numero/null} devuelve status 200 y {id: numero, nombre:string, 
 descripcion:string, categoria_id:numero, persona_id:numero/null} modificado o 
 bien status 413, {mensaje: <descripcion del error>} "error inesperado",  
 "solo se puede modificar la descripcion del libro */

app.put('/libro/:id', async(req, res) => {
    try {
        if (!req.body.nombre_libro || !req.body.descripcion_libro || !req.body.id_categoria) {
            throw new Error('No se enviaron los datos necesarios para hacer un update');
        }
        if (await trim.conEspacios(req.body.nombre_libro)||
        	await trim.conEspacios(req.body.descripcion_libro)||
        	await trim.conEspacios(req.body.id_categoria)) {
			throw new Error('Los campos requeridos no pueden permanecer vacios');
		}
        const nombre = req.body.nombre_libro.toUpperCase();
        const descripcion = req.body.descripcion_libro.toUpperCase();

        //VERIFICACIÓN LIBRO id
        let respuesta = await libroController.verificarLibroId(req.params.id);
        if (respuesta.length == 0) {
            throw new Error('Ese libro no existe')
        }
        //VERIFICACIÓN CATEGORIA
        respuesta = await categoriaController.verificarCategoriaID(req.body.id_categoria);
        if (respuesta.length == 0) {
            throw new Error('No existe la categoria indicada')
        }

        // VERIFICACIÓN PERSONA
        if (req.body.id_persona != null) {
            let respuesta = await personaController.verPersonaId(req.body.id_persona);
            if (respuesta.length == 0) {
                throw new Error('No se encuentra esa persona');
            }
        }

        //INSERCION
        respuesta = await libroController.actualizarLibro([nombre, descripcion, req.body.id_categoria, req.body.id_persona, req.params.id]);
        console.log(respuesta);
        res.status(200).send({
            'id': req.params.id,
            'nombre': nombre,
            'descripcion': descripcion,
            'categoria_id': req.body.id_categoria,
            'persona_id': req.body.id_persona
        });

    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            "Error": e.message
        });
    }

});

/* 14 - Put prestar ID <<<<<<<<<<<<<<<<<<<

'/libro/prestar/:id' y {id:numero, persona_id:numero} devuelve 200 y 
{mensaje: "se presto correctamente"} o bien status 413, 
{mensaje: <descripcion del error>} "error inesperado", "el libro ya se encuentra 
prestado, no se puede prestar hasta que no se devuelva", "no se encontro el libro", 
"no se encontro la persona a la que se quiere prestar el libro" */

app.put('/libro/prestar/:id', async(req, res) => {
    try {

        //VERIFICACIÓN LIBRO id
        let respuesta = await libroController.verificarLibroId(req.params.id);
        if (respuesta.length == 0) {
            throw new Error('Ese libro no existe')
        }
        // verifico si el libro ya fue prestado
        const idPersona = respuesta[0].id_persona;
        if (idPersona != null) {
            throw new Error("El libro ya fue prestado");
        }
        if (await trim.conEspacios(req.body.id_persona)){
			throw new Error('Los campos requeridos no pueden permanecer vacios');
		}
        // VERIFICACIÓN PERSONA
        if (req.body.id_persona != null) {
            let respuesta = await personaController.verPersonaId(req.body.id_persona);
            if (respuesta.length == 0) {
                throw new Error('No se encuentra esa persona');
            }
        }

        respuesta = await libroController.prestarLibro([req.body.id_persona, req.params.id]);

        res.status(200).send({
            "respuesta": "El libro se presto correctamente"
        });

    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            "Error": e.message
        });
    }

});

/* 15 - Put devolver ID <<<<<<<<<<<<<<<<<<< 

'/libro/devolver/:id' y {} devuelve 200 y {mensaje: "se realizo la devolucion 
correctamente"} o bien status 413, {mensaje: <descripcion del error>} 
"error inesperado", "ese libro no estaba prestado!", "ese libro no existe" */

app.put('/libro/devolver/:id', async(req, res) => {
    try {
        //VERIFICACIÓN LIBRO id
        let respuesta = await libroController.verificarLibroId(req.params.id);
        if (respuesta.length == 0) {
            throw new Error('Ese libro no existe')
        }
        // verifico si el libro ya fue prestado
        const idPersona = respuesta[0].id_persona;
        if (idPersona == null) {
            throw new Error("El libro no esta prestado");
        }

        respuesta = await libroController.prestarLibro([null, req.params.id]);

        res.status(200).send({
            "respuesta": "El libro fue devuelto correctamente"
        });

    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            "Error": e.message
        });
    }
});

/* 16 - Delete ID 

'/libro/:id' devuelve 200 y {mensaje: "se borro correctamente"}  
o bien status 413, {mensaje: <descripcion del error>} 
"error inesperado", "no se encuentra ese libro", "ese libro esta prestado no 
se puede borrar" */

app.delete("/libro/:id", async(req, res) => {
    try {
        //VERIFICACIÓN LIBRO id
        let respuesta = await libroController.verificarLibroId(req.params.id);
        if (respuesta.length == 0) {
            throw new Error('Ese libro no existe')
        }

        if (respuesta[0].id_persona != null) {
            throw new Error(
                "Ese libro esta prestado, no se puede borrar"
            );
        }

        //Si cumple con todas las condiciones procedo a borrar ID
        respuesta = await libroController.borrarLibro([req.params.id]);

        res.status(200).send({
            respuesta: "Se borro correctamente",
        });

    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});