'use strict'

/* Pedidos de paquetes ------------------------------------------*/

const express = require('express');
const mysql = require('mysql');
const util = require('util');
const jwt = require('jsonwebtoken');

/* Declaración del paquete express en aplicación-----------------*/

const app = express();

/* Llamada de función especifica del paquete---------------------*/

app.use(express.json()); //permite el mapeo de la peticion json a object js 
app.use(express.static('public')); // permite uso de la carpeta con el nombre expresado

/* Conexion con MySql ---------------------------------------*/

const conexion = mysql.createConnection({
	host: 'localhost', //por ahora porque trabajos de forma local
	user: 'root',
	password: '',
	database: 'mislibros'
});

conexion.connect((error) => {
	if (error) {
		throw error;
	}
	console.log('Conexion MySql exitosa')
});

// a partir del Util de express 'promisify' nos permite crear async/await en la conexion MySql

const qy = util.promisify(conexion.query).bind(conexion);

/* ¿Por qué? Porque Async/await solo puede ubicarse en el lugar de 
	las PROMESAS, NO SOBRE CALLBACK´s. Entonces lo que hace es transformar
	en promesa la callback del pedido de query */


// Establecer puerto  ----------------------------------------

const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => {
	console.log('Aplicación operativa.\nEscuchando el puerto ' + port)
});

// Login ----------------------------------------------------- 

app.post('/login', (req, res) => {

	if (!req.body.user || !req.body.pass) {
		res.send({
			error : 'No mandaste todos los datos'
		})
		return;
	}

	if (req.body.user == 'lore' && req.body.pass == '123') {

		const tokenData = {
			nombre: 'lala',
			apellido: 'lele'
		}
		// Se utiliza una palabra determinada para codificar el token
		const token = jwt.sign(tokenData, 'Secret', {
			expiresIn: 60 * 60 * 24 // en este caso, expira en 24hs
		})

		res.send({
			token
		});

	} else {
		res.send({
			error : 'Usuario o clave incorrecta'
		})
	}
});

app.get('/biblioteca', (req, res) => {
	let token = req.headers['authorization']

	if(!token){
		console.log('error');
		return;
	}

	token = token.replace('Bearer ', '')

	//Verify toma el token y lo decodifica
	jwt.verify(token, 'Secret', (err, user) => {
		if(err) {
			res.status(401).send({
				error: 'Token invalido'
			})
		} else {
			//Recupera los datos del usuario que fue codificado en el token
			//En este caso le hacemos un console log para ver los datos del token
			console.log('esto es user ', user) 
			res.send({
				message: '¡Bienvenido a tu libreria!'
			})
		}
	})
});

// Desarrollo de la lógica en la API ////////////////////////////////



// CATEGORIA --------------------------------------------------------


/* 1 - Post <<<<<<<<<<<<<<<<<< 

Categoria recibe: {nombre:sting} retorna status 200{id: numerico, nombre:string} - 
status 413, {mensaje: <descripcion del error> que puede ser:
"faltan datos", "ese nombre de categoria ya existe", "error inesperado" **/

app.post('/categoria', async (req, res) => { //Se espera la respuesta antes de seguir con el programa 

	try {
		//Validación de envio correcto de informacion
		if (!req.body.nombre_categoria) {
			throw new Error('Falta enviar el nombre');
			//Si no hay declaración de JSON "nombre" en el body tira error
		}
		//Declaración de variable con funcion para estandarizarla en mayusculas
		const nombre = req.body.nombre_categoria.toUpperCase(); 

		//Verifico que no exista previamente esa categoria
		let query = 'SELECT id_categoria FROM genero WHERE nombre_categoria = ?';
		let respuesta = await qy(query, [nombre]);

		if (respuesta.length > 0) { // Si no me arroja ningun resultado entonces el query esta vacio
			throw new Error('Ese nombre de categoria ya existe')
		}

		//Guardo la nueva categoría
		query = 'INSERT INTO genero (nombre_categoria) VALUE (?)';
		respuesta = await qy(query, [nombre]);

		res.status(200).send({
			'Nombre': nombre,
			'Id': respuesta.insertId
		});
	} catch (e) {
		console.log(e.message);
		res.status(413).send({
			'Error': e.message
		});
	}
});

/* 2 - Get CATEGORIA <<<<<<<<<<<<<<<<<<

'/categoria' retorna: status 200  y [{id:numerico, nombre:string}]  
- status: 413 y [] */

app.get('/categoria', async (req, res) => {
	try {
		const query = 'SELECT * FROM genero';
		const respuesta = await qy(query);

		res.status(200).send({
			'respuesta': respuesta // Devuelve JSON 
		});
	} catch (e) {
		console.log(e.message);
		res.status(413).send({
			'Error': e.message
		});
	}
});

/* 3 - Get ID <<<<<<<<<<<<<<<<<<

'/categoria/:id' retorna: status 200 y {id: numerico, nombre:string} - 
status: 413, {mensaje: <descripcion del error>} que puede 
ser: "error inesperado", "categoria no encontrada" */

app.get('/categoria/:id', async (req, res) => {
	try {
		//Consulta MySQL
		const query = 'SELECT * FROM genero WHERE id_categoria=?' 
		const respuesta = await qy(query, [req.params.id]); 

		res.status(200).send({
			respuesta
		});
	} catch (e) {
		console.log(e.message);
		res.status(413).send({
			'Error': 'Error inesperado'
		});
	}
});

/* 4 - Delete <<<<<<<<<<<<<<<<<<

'/categoria/:id' retorna: status 200 y {mensaje: "se borro correctamente"} 
- status: 413, {mensaje: <descripcion del error>} que puese ser: "error inesperado", 
"categoria con libros asociados, no se puede eliminar", "no existe la categoria 
indicada" */

app.delete('/categoria/:id', async (req, res) => {
	try {
		//chequeo en 'libros' para ver si la categoria esta en uso declarando query y respuesta
		let query = 'SELECT * FROM libros WHERE id_categoria = ?';
		let respuesta = await qy(query, [req.params.id]);

		if (respuesta.length > 0) {
			throw new Error("Esta categoria tiene libros asociados, no se puede eliminar");
		}

		query = 'DELETE FROM genero WHERE id_categoria = ?';
		respuesta = await qy(query, [req.params.id]);

		res.status(200).send({
			"respuesta": 'Se borro correctamente'
		});
	} catch (e) {
		console.error(e.message);
		res.status(413).send({
			"Error": e.message
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

app.post('/persona', async (req, res) => {
	try {
		//Validación de envio correcto de informacion
		if (!req.body.email_persona || !req.body.apellido_persona || !req.body.nombre_persona) {
			throw new Error('Faltan datos');
			//Si no hay declaraciones JSON en el body tira error (alias_persona puede permanecer NULL)
		}
		//Declaracion de variables y standarizacion de datos
		const email = req.body.email_persona.toUpperCase();
		const apellido = req.body.apellido_persona.toUpperCase();
		const nombre = req.body.nombre_persona.toUpperCase();
		const alias = req.body.alias_persona.toUpperCase();

		//Verifico si existe previamente esa persona a través del email
		let query = 'SELECT id_persona FROM personas WHERE email_persona = ?';
		let respuesta = await qy(query, [email]);

		//Si no me arroja ningun resultado entonces la consulta del query esta vacia
		if (respuesta.length > 0) {
			throw new Error('El email ya se encuentra registrado')
		}
		//Si no hay resultado entonces el ingreso es inexistente
		//Procedo a guardar los datos
		query = 'INSERT INTO personas (nombre_persona, apellido_persona, email_persona, alias_persona) VALUES (?,?,?,?)';
		respuesta = await qy(query, [nombre, apellido, email, alias]);

		res.status(200).send({
			"Id": respuesta.insertId,
			"Nombre": nombre,
			"Apellido": apellido,
			"Email": email,
			"Alias": alias
		});
	} catch (e) {
		// statements
		console.log(e.message);
		res.status(413).send({
			'Error': e.message
		});
	}
});

/* 6 - Get <<<<<<<<<<<<<<<<<< 

'/persona' retorna status 200 y [{id: numerico, nombre: string, apellido: 
string, alias: string, email; string}] o bien status 413 y [] */

app.get('/persona', async (req, res) => {
	try {
		const query = 'SELECT * FROM personas'
		const respuesta = await qy(query);
		res.status(200).send({
			'respuesta': respuesta
		});
	} catch (e) {
		console.log(e.message);
		res.status(413).send({
			'Error': e.message
		});
	}
});


/* 7 - Get ID <<<<<<<<<<<<<<<<<<

'/persona/:id' retorna status 200 y {id: numerico, nombre: string, 
apellido: string, alias: string, email; string} - status 413,
 {mensaje: <descripcion del error>} "error inesperado", 
 "no se encuentra esa persona" */

app.get('/persona/:id', async (req, res) => {
	try {
		const query = 'SELECT * FROM personas WHERE id_persona = ?';
		const respuesta = await qy(query, [req.params.id]);

		if (respuesta.length == 0) {
			throw new Error('No se encuentra esa persona');
		}

		res.status(200).send({
			"respuesta": respuesta
		});
	} catch (e) {
		console.error(e.message);
		res.status(413).send({
			"Error": e.message
		});
	}
});

/* 8 - Put ID <<<<<<<<<<<<<<<<<<

'/persona/:id' recibe: {nombre: string, apellido: string, alias: string, 
email: string} el email no se puede modificar. 
retorna status 200 y el objeto modificado o bien status 413, 
{mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa 
persona" */

app.put('/persona/:id', async (req, res) => {
	const id = req.params.id;
	try {
		//Declaracion e inicializacion de variables con standarizacion de datos con función uppercase
		const email = req.body.email_persona.toUpperCase();
		const apellido = req.body.apellido_persona.toUpperCase();
		const nombre = req.body.nombre_persona.toUpperCase();
		const alias = req.body.alias_persona.toUpperCase();

		//Verifico que los datos pertenecen al mismo id y además que el email no se ha modificado
		let query = 'SELECT * FROM personas WHERE email_persona = ? AND id_persona = ?';
		let respuesta = await qy(query, [email, id]);

		if (respuesta.length < 1) {
			throw new Error('El email no se puede modificar');
		}

		//Procedo a la inserción de datos
		query = 'UPDATE personas SET nombre_persona = ?, apellido_persona = ?, alias_persona = ? WHERE id_persona = ?';
		respuesta = await qy(query, [nombre, apellido, alias, id]);

		res.status(200).send({
			respuesta
		})
	} catch (e) {
		console.log(e.message);
		res.status(413).send({
			'Error': e.message
		});
	}
}); 

/* 9 - Delete ID <<<<<<<<<<<<<<<<<<

'/persona/:id' retorna: 200 y {mensaje: "se borro correctamente"} o 
bien 413, {mensaje: <descripcion del error>} "error 
inesperado", "no existe esa persona", "esa persona tiene libros asociados, 
no se puede eliminar" */

app.delete("/persona/:id", async (req, res) => {
	try {
		//chequeo en 'libros' para ver si la persona esta en uso
		let query = "SELECT * FROM libros WHERE id_persona = ?";
		let respuesta = await qy(query, [req.params.id]);

		if (respuesta.length > 0) {
			throw new Error(
				"Esta persona tiene libros asociados, no se puede eliminar"
			);
		}
		//Sino tiene asociaciones con otras tablas procedo a borrar ID
		query = "DELETE FROM personas WHERE id_persona = ?";
		respuesta = await qy(query, [req.params.id]);

		res.status(200).send({
			respuesta: "Se borro correctamente",
		});
	} catch (e) {
		console.error(e.message);
		res.status(413).send({
			'Error': e.message
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

app.post('/libro', async (req, res) => {
	try {
		//Validación de envio correcto de informacion
		if (!req.body.nombre_libro || !req.body.descripcion_libro || !req.body.id_categoria) {
			throw new Error('Nombre y Categoría son datos obligatorios');
		}

		const nombre = req.body.nombre_libro.toUpperCase();

		//Verifico que no exista previamente el libro
		let query = 'SELECT nombre_libro FROM libros WHERE nombre_libro = ?';
		let respuesta = await qy(query, [nombre]);

		if (respuesta.length > 0) {
			throw new Error('Ese libro ya existe')
		}

		//Verifico que exista previamente esa categoria
		query = 'SELECT id_categoria FROM genero WHERE id_categoria = ?';
		respuesta = await qy(query, [req.body.id_categoria]);

		if (respuesta.length == 0) {
			throw new Error('No existe la categoria indicada')
		}

		if (req.body.id_persona != null) {
			//Verifico que exista previamente la persona
			query = 'SELECT id_persona FROM personas WHERE id_persona = ?';
			respuesta = await qy(query, [req.body.id_persona]);

			if (respuesta.length == 0) {
				throw new Error('No existe la persona indicada')
			}
		}

		//Guardo el nuevo libro
		query = 'INSERT INTO libros (nombre_libro, descripcion_libro, id_categoria, id_persona) VALUE (?,?,?,?)';
		respuesta = await qy(query, [nombre, req.body.descripcion_libro, req.body.id_categoria, req.body.id_persona]);

		res.status(200).send({
			'Id': respuesta.insertId,
			'Nombre': nombre,
			'Descripcion': req.body.descripcion_libro,
			'Categoria': req.body.id_categoria,
			'Persona': req.body.id_persona
		});
	} catch (e) {
		console.log(e.message);
		res.status(413).send({
			'Error': e.message
		});
	}
});


/* 11 - Get <<<<<<<<<<<<<<<<<<

GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, 
categoria_id:numero, persona_id:numero/null}] o bien 413,
{mensaje: <descripcion del error>} "error inesperado" */

app.get('/libro', async (req, res) => {
	try {
		const query = 'SELECT * FROM libros';
		const respuesta = await qy(query);
		res.status(200).send({
			"respuesta": respuesta
		});
	} catch (e) {
		console.error(e.message);
		res.status(413).send({
			"Error": e.message
		});

	}
});

/* 12 - Get ID <<<<<<<<<<<<<<<<<<<

GET '/libro/:id' devuelve 200 {id: numero, nombre:string, descripcion:string, 
categoria_id:numero, persona_id:numero/null} y status 413, {mensaje: 
<descripcion del error>} "error inesperado", "no se encuentra ese libro" */

app.get('/libro/:id', async (req, res) => {
	try {

		const query = 'SELECT * FROM libros WHERE id_libro = ?';
		const respuesta = await qy(query, [req.params.id]);

		if (respuesta.length == 0) {
			throw new Error('No se encuentra ese libro');
		}

		res.status(200).send({
			"respuesta": respuesta
		});
	} catch (e) {
		console.error(e.message);
		res.status(413).send({
			"Error": e.message
		});
	}
});

/* 13 - Put ID <<<<<<<<<<<<<<<<<<<

'/libro/:id' y {id: numero, nombre:string, descripcion:string, categoria_id:numero,
 persona_id:numero/null} devuelve status 200 y {id: numero, nombre:string, 
 descripcion:string, categoria_id:numero, persona_id:numero/null} modificado o 
 bien status 413, {mensaje: <descripcion del error>} "error inesperado",  
 "solo se puede modificar la descripcion del libro */


/* 14 - Put prestar ID <<<<<<<<<<<<<<<<<<<

'/libro/prestar/:id' y {id:numero, persona_id:numero} devuelve 200 y 
{mensaje: "se presto correctamente"} o bien status 413, 
{mensaje: <descripcion del error>} "error inesperado", "el libro ya se encuentra 
prestado, no se puede prestar hasta que no se devuelva", "no se encontro el libro", 
"no se encontro la persona a la que se quiere prestar el libro" */


/* 15 - Put devolver ID <<<<<<<<<<<<<<<<<<< 

'/libro/devolver/:id' y {} devuelve 200 y {mensaje: "se realizo la devolucion 
correctamente"} o bien status 413, {mensaje: <descripcion del error>} 
"error inesperado", "ese libro no estaba prestado!", "ese libro no existe" */


/* 16 - Delete ID 

'/libro/:id' devuelve 200 y {mensaje: "se borro correctamente"}  
o bien status 413, {mensaje: <descripcion del error>} 
"error inesperado", "no se encuentra ese libro", "ese libro esta prestado no 
se puede borrar" */
