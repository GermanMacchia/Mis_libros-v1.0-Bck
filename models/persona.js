const conn = require('../conn');
const DATABASE = 'mislibros';
const PERSONAS = 'personas';

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
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(PERSONAS)
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
	},
	resetPersonas: async () => {
	let respuesta = await conexion.query(
		"ALTER TABLE personas AUTO_INCREMENT = 1");
	return respuesta;
	}
}