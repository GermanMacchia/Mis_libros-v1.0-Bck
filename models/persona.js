const conexion = require('../db.js');

module.exports = {
	personVerify: async (email) => {
		var respuesta = await conexion.query(
			'SELECT * FROM personas WHERE email_persona = ?', [email]);
		return respuesta;
	},
	saveNewPerson: async ([nombre, apellido, email, alias]) => {
		var respuesta = await conexion.query(
			'INSERT INTO personas (nombre_persona, apellido_persona, email_persona, alias_persona) VALUES (?,?,?,?)', [nombre, apellido, email, alias]);
		return respuesta;
	},
	seePersonList: async () => {
		var respuesta = await conexion.query(
			'SELECT * FROM personas');
		return respuesta;
	},
	seePersonId: async (id) => {
		var respuesta = await conexion.query(
		'SELECT * FROM personas WHERE id_persona = ?', [id]);
		return respuesta;
	},
	doubleCheck: async ([email, id]) => {
		var respuesta = await conexion.query(
		'SELECT * FROM personas WHERE email_persona = ? AND id_persona = ?', [email, id]);
		return respuesta;
	},
	updatePerson: async ([nombre, apellido, alias, id]) => {
		var respuesta = await conexion.query(
			'UPDATE personas SET nombre_persona = ?, apellido_persona = ?, alias_persona = ? WHERE id_persona = ?', [nombre, apellido, alias, id]);
		return respuesta;
	},
	bookPerson: async (id) => {
		var respuesta = await conexion.query(
			"SELECT * FROM libros WHERE id_persona = ?", [id]);
		return respuesta;
	},
	deletePerson: async (id) => {
		var respuesta = await conexion.query(
			"DELETE FROM personas WHERE id_persona = ?", [id]);
		return respuesta;
	}
}