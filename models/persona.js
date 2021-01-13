const conexion = require('../db.js');

module.exports = {
	personVerify: async (email) => {
		var respuesta = await conexion.query(
			'SELECT * FROM personas WHERE email = ?', [email]);
		return respuesta;
	},
	saveNewPerson: async ([nombre, apellido, email, alias]) => {
		var respuesta = await conexion.query(
			'INSERT INTO personas (nombre, apellido, email, alias) VALUES (?,?,?,?)', [nombre, apellido, email, alias]);
		return respuesta;
	},
	seePersonList: async () => {
		var respuesta = await conexion.query(
			'SELECT * FROM personas');
		return respuesta;
	},
	personaId: async (id) => {
		var respuesta = await conexion.query(
		'SELECT * FROM personas WHERE id = ?', [id]);
		return respuesta;
	},
	doubleCheck: async ([email, id]) => {
		var respuesta = await conexion.query(
		'SELECT * FROM personas WHERE email = ? AND id= ?', [email, id]);
		return respuesta;
	},
	updatePerson: async ([nombre, apellido, alias, id]) => {
		var respuesta = await conexion.query(
			'UPDATE personas SET nombre = ?, apellido = ?, alias = ? WHERE id = ?', [nombre, apellido, alias, id]);
		return respuesta;
	},
	bookPerson: async (id) => {
		var respuesta = await conexion.query(
			"SELECT * FROM libros WHERE persona_id = ?", [id]);
		return respuesta;
	},
	deletePerson: async (id) => {
		var respuesta = await conexion.query(
			"DELETE FROM personas WHERE id = ?", [id]);
		return respuesta;
	}
}