const conexion = require('../db.js');

module.exports = {
	mailPersona: async (email) => {
		let respuesta = await conexion.query(
			'SELECT * FROM personas WHERE email = ?', [email]);
		return respuesta;
	},
	guardarPersona: async (persona) => {
		let respuesta = await conexion.query(
			'INSERT INTO personas (nombre, apellido, email, alias) VALUES (?,?,?,?)', 
			[persona.nombre, persona.apellido, persona.email, persona.alias]);
		return respuesta;
	},
	listaPersonas: async () => {
		let respuesta = await conexion.query(
			'SELECT * FROM personas');
		return respuesta;
	},
	personaId: async (id) => {
		let respuesta = await conexion.query(
		'SELECT * FROM personas WHERE id = ?', [id]);
		return respuesta;
	},
	verificacionDoble: async (persona) => {
		let respuesta = await conexion.query(
		'SELECT * FROM personas WHERE email = ? AND id= ?', 
		[persona.email, persona.id_params]);
		return respuesta;
	},
	personaUpdate: async (persona) => {
		let respuesta = await conexion.query(
			'UPDATE personas SET nombre = ?, apellido = ?, alias = ? WHERE id = ?', 
			[persona.nombre, persona.apellido, persona.alias, persona.id_params]);
		return respuesta;
	},
	librosPersona: async (id) => {
		let respuesta = await conexion.query(
			"SELECT * FROM libros WHERE persona_id = ?", [id]);
		return respuesta;
	},
	borrarPersona: async (id) => {
		let respuesta = await conexion.query(
			"DELETE FROM personas WHERE id = ?", [id]);
		return respuesta;
	}
}