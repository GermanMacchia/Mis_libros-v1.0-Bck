const mysql = require('mysql');
const util = require('util');
const settings = require('./settings.json')
var db;

function connectDataBase() {
	if (!db) {
		//por ahora porque trabajos de forma local
		db = mysql.createConnection(settings);

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