const conexion = require('../db.js');

module.exports = {
	nombreUsuario: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT * from usuarios WHERE nombre = ?', 
			[usuario]);
		return respuesta;
	},
	claveUsuario: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT clave_encriptada FROM usuarios WHERE nombre = ?', 
			[usuario]);
		return respuesta;
	},
	emailUsuario: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT email FROM usuarios WHERE nombre = ?', 
			[usuario]);
		return respuesta;
	},
	idUsuario: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT id  FROM usuarios WHERE nombre = ?', 
			[usuario]);
		return respuesta;
	},
	nuevoUsuario: async (usuario) => {
		var respuesta = await conexion.query(
			'INSERT INTO usuarios (nombre, clave_encriptada, email, celu) VALUE (?,?,?,?)', 
			[usuario.usuario, usuario.clave, usuario.email, usuario.celu]);
		return respuesta;
	}
}