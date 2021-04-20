const mysql = require('mysql');
const util = require('util');
var db;
require('dotenv').config();

function connectDataBase() {
	if (!db) {
		//por ahora porque trabajos de forma local
		db = mysql.createPool(
			{
				"connectionLimit": 10,
				"host": process.env.HOST,
				"user": process.env.USER,
				"password": process.env.PASSWORD,
				"database": process.env.DB
			}
		);

		db.getConnection((err, connection) => {
			if (err) {
				if (err.code === 'PROTOCOL_CONNECTION_LOST') {
					console.error('Database connection was closed.')
				}
				if (err.code === 'ER_CON_COUNT_ERROR') {
					console.error('Database has too many connections.')
				}
				if (err.code === 'ECONNREFUSED') {
					console.error('Database connection was refused.')
				}
    		}    
	
			if (connection) connection.release() 

			return
			/*
			if (!err) {
				console.log('Conexion mySql exitosa');
			} else {
				console.log('Error en la conexion mySql');
			}*/
		});
	}

	db.query = util.promisify(db.query);
	return db;
}

module.exports = connectDataBase();