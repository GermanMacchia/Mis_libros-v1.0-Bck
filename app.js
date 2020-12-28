'use strict'

/* Pedidos de paquetes ------------------------------------------*/
const express = require('express');
const mysql = require('mysql');
const util = require('util');

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

// a partir del Util de express, primisify nos permite crear async/await en la conexion MySql
const qy = util.promisify(conexion.query).bind(conexion);
/* ¿porque? Async/await solo puede ubicarse en el lugar de 
	las promesas, NO SOBRE CALLBACK. Entonces lo que hace es transformar
	en promesa la callback del pedido de query * /


/* Establecer puerto  ---------------------------------*/
const port = 3000;
app.listen(port, () => {
	console.log('Aplicación operativa.\nEscuchando el puerto ' + port)
});


// Desarrollo de la lógica en la API -----------------------------------------------


// CATEGORIA ------------------------

	/* POST para guardar una categoria (GENERO) nueva. 

	Categoria recibe: {nombre:sting} retorna status 200
	{id: numerico, nombre:string} - status 413, {mensaje: <descripcion del error> que puede ser:
	"faltan datos", "ese nombre de categoria ya existe", "error inesperado" **/

app.post('/categoria', async (req, res) => { //Se espera la respuesta antes de seguir con el programa 
	try {
		if (!req.body.nombre) { //Validación de envio correcto de informacion
			throw new Error('Falta enviar el nombre'); //Si no hay JSON en el body tira error
		}

		const nombre = req.body.nombre.toUpperCase(); //Funcion para estandarizarla en mayusculas

		//Verifico que no exista previamente esa categoria
		let query = 'SELECT id_categoria FROM genero WHERE nombre_categoria = ?';
		let respuesta = await qy(query, [nombre]);

		if (respuesta.length > 0) { //si no me arroja ningun resultado entonces el query esta vacio
			throw new Error('Ese nombre de genero ya existe')
		}

		//Guardo la nueva categoría
		query = 'INSERT INTO genero (nombre_categoria) VALUE (?)';
		respuesta = await qy(query, [nombre]);

		res.status(200).send({
			'Nombre': nombre,
			'Id': respuesta.insertId
		});

	} catch (e) {
		// statements
		console.log(e.message);
		res.status(413).send({
			'error': e.message
		});
	}
});

	/* DELETE '/categoria/:id' retorna: status 200 y {mensaje: "se borro correctamente"} 
	- status: 413, {mensaje: <descripcion del error>} que puese ser: "error inesperado", 
	"categoria con libros asociados, no se puede eliminar", "no existe la categoria 
	indicada" */

app.delete('/categoria/:id', async (req, res) => {
	try {
		let query = 'SELECT * FROM libros WHERE id_categoria = ?'; //chequeo en 'libros' para ver si la categoria esta en uso

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


	/* GET '/categoria/:id' retorna: status 200 y {id: numerico, nombre:string} - 
	status: 413, {mensaje: <descripcion del error>} que puede 
	ser: "error inesperado", "categoria no encontrada" */

app.get('/categoria/:id', async (req, res) => { //Se espera la respuesta antes de seguir con el programa con id req.params
	try {
		const query = 'SELECT * FROM genero WHERE id_categoria=?' //Consulta MySQL
		const respuesta = await qy(query, [req.params.id]); // async de la consulta y array de remplazo con los comodines en orden
		res.status(200).send({
			respuesta //se manda JSON 
		});

	} catch (e) {
		// statements
		console.log(e.message);
		res.status(413).send({
			'error': 'Error inesperado'
		});
	}
});

	/* GET '/categoria' retorna: status 200  y [{id:numerico, nombre:string}]  
	- status: 413 y [] */

app.get('/categoria', async (req, res) => {  //Se espera la respuesta antes de seguir con el programa
	try {
		const query = 'SELECT * FROM genero' //Consulta MySQL
		const respuesta = await qy(query); 
		res.status(200).send({
			'respuesta': respuesta           // Devuelve JSON 
		});
	} catch (e) {
		console.log(e.message);
		res.status(413).send({
			'error': e.message
		});
	}
});



//PERSONA--------------------------


	/* GET '/persona' retorna status 200 y [{id: numerico, nombre: string, apellido: string, alias: string, email; string}] o bien status 
	413 y [] */

app.get('/personas', async (req, res) => {
	try {
		const query = 'SELECT * FROM personas' //Consulta MySQL
		const respuesta = await qy(query);
		res.status(200).send({
			'respuesta': respuesta //devuelve JSON 
		});
	} catch (e) {
		console.log(e.message);
		res.status(413).send({
			'error': e.message
		});
	}
});

	/* POST '/persona' recibe: {nombre: string, apellido: string, 
	alias: string, email: string} retorna: status: 200, 
	{id: numerico, nombre: string, apellido: string, alias: string, email: string} - 
 	status: 413, {mensaje: <descripcion del error>} que puede ser: "faltan 
	datos", "el email ya se encuentra registrado", "error inesperado" */

app.post('/personas', async (req, res) => { //Se espera la respuesta antes de seguir con el programa 
	try {
		if (!req.body.email || !req.body.apellido || !req.body.nombre || !req.body.alias) { //Validación de envio correcto de informacion
			throw new Error('Faltan datos'); //Si no hay JSON en el body tira error
		}

		const email = req.body.email.toUpperCase();
		const apellido = req.body.apellido.toUpperCase();
		const nombre = req.body.nombre.toUpperCase();
		const alias = req.body.alias.toUpperCase();

		//Verifico que no exista previamente esa persona a través del email
		let query = 'SELECT id_persona FROM personas WHERE email_persona = ?';
		let respuesta = await qy(query, [email]);

		if (respuesta.length > 0) { //si no me arroja ningun resultado entonces el query esta vacio
			throw new Error('El email ya se encuentra registrado')
		}

		//Guardo los datos
		query = 'INSERT INTO personas (nombre_persona, apellido_persona, email_persona, alias_persona) VALUES (?,?,?,?)';
		respuesta = await qy(query, [nombre, apellido, email, alias]);

		res.status(200).send({
			"Id": respuesta.insertId,
			"Nombre": nombre,
			"Apellido": apellido,
			"Email": email,
			"Alias": alias
		})

	} catch (e) {
		// statements
		console.log(e.message);
		res.status(413).send({
			'error': e.message
		});
	}
});

//LIBRO-----------------------------

	/*POST '/libro' recibe: {nombre:string, descripcion:string, 
	categoria_id:numero, persona_id:numero/null} devuelve 200 y 
	{id: numero, nombre:string, descripcion:string, categoria_id:numero,
	persona_id:numero/null} o bien status 413,  {mensaje: <descripcion del error>} 
	que puede ser "error inesperado", "ese libro ya existe", 
	"nombre y categoria son datos obligatorios", "no existe la categoria indicada", 
	"no existe la persona indicada"*/

app.post('/libro', async (req, res) => { //Se espera la respuesta antes de seguir con el programa 
	try {
		if (!req.body.nombre || !req.body.descripcion || !req.body.categoria_id) { //Validación de envio correcto de informacion
			throw new Error('Nombre y Categoría son datos obligatorios'); //Si no hay JSON en el body tira error
		}

		const nombre = req.body.nombre.toUpperCase(); //Funcion para estandarizarla en mayusculas
		
		//Verifico que no exista previamente el libro
		let query = 'SELECT nombre_libro FROM libros WHERE nombre_libro = ?';
		let respuesta = await qy(query, [nombre]);

		if (respuesta.length > 0) { //si no me arroja ningun resultado entonces el query esta vacio
			throw new Error('Ese libro ya existe')
		}

		//Verifico que exista previamente esa categoria
		query = 'SELECT id_categoria FROM genero WHERE id_categoria = ?';
		respuesta = await qy(query, [req.body.categoria_id]);

		if (respuesta.length == 0) { //si no me arroja ningun resultado entonces el query esta vacio
			throw new Error('No existe la categoria indicada')
		}
		
		if (req.body.persona_id != null){
			//Verifico que exista previamente la persona
			query = 'SELECT id_persona FROM personas WHERE id_persona = ?';
			respuesta = await qy(query, [req.body.persona_id]);

			if (respuesta.length == 0) { //si no me arroja ningun resultado entonces el query esta vacio
				throw new Error('No existe la persona indicada')
			}
		}	

		//Guardo el nuevo libro
		query = 'INSERT INTO libros (nombre_libro, descripcion_libro, id_categoria, id_persona) VALUE (?,?,?,?)';
		respuesta = await qy(query, [nombre, req.body.descripcion, req.body.categoria_id, req.body.persona_id]);

		res.status(200).send({
			'Id': respuesta.insertId,
			'Nombre': nombre,
			'Descripcion': req.body.descripcion,
			'Categoria': req.body.categoria_id,
			'Persona': req.body.persona_id			
		});

	} catch (e) {
		// statements
		console.log(e.message);
		res.status(413).send({
			'error': e.message
		});
	}
});	