'use strict'

/* Pedidos de paquetes ------------------------------------------*/
const express = require('express');
const mysql = require('mysql');
const util = require('util');

/* Declaración del paquete express en aplicación-----------------*/
const app = express();

/* Llamada de función especifica del paquete---------------------*/

app.use(express.json()); //permite el mapeo de la peticion json a object js
app.use(express.static('public')); // permite uso de la carpeta

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

// a partir del Util de express nos permite crear async/await en la conexion MySql
const qy = util.promisify(conexion.query).bind(conexion);
/* ¿porque? Async/await solo puede ubicarse en el lugar de 
	las promesas, NO SOBRE CALLBACK. Entonces lo que hace es transformar
	en promesa la callback del pedido de query * /


	/* Establecer puerto  ---------------------------------*/
const port = 3000;
app.listen(port, () => {
	console.log('Aplicación operativa.\nEscuchando el puerto ' + port)
});


// Desarrollo de la lógica en la API 

