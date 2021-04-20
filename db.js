const mysql = require('mysql');
const util = require('util');
var db;
require('dotenv').config();

function connectDataBase() {
	if (!db) {
		//por ahora porque trabajos de forma local
		db = mysql.createConnection(
			{
				"host": process.env.HOST,
				"user": process.env.USER,
				"password": process.env.PASSWORD,
				"database": process.env.DB
			}
		);

		db.connect((err) => {
			if (!err) {
				console.log('Conexion mySql exitosa');
			} else {
				console.log('Error en la conexion mySql');
			}
		});
	}

	db.query = util.promisify(db.query);
	return db;
}

module.exports = connectDataBase();