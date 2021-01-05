const mysql = require('mysql');
const util = require('util');
var db;

function connectDataBase() {

	if (!db) {
		//por ahora porque trabajos de forma local
		db = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'mislibros'
		});

		db.connect(function(err) {
			if (err) {
				console.log('Ya estas conectado a la base de datos');
			} else {
				console.log('Error conectando a la base de datos');
			}
		});
	}
	db.query = util.promisify(db.query);
	return db;
}

module.exports = connectDataBase();