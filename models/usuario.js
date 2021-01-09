const conexion = require('../db.js');

module.exports = {
	userNameVerify: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT * from usuarios WHERE nombre = ?', [usuario]);
		return respuesta;
	},
	checkUserPass: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT clave_encriptada FROM usuarios WHERE nombre = ?', [usuario]);
		return respuesta;
	},
	checkEmailUser: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT email FROM usuarios WHERE nombre = ?', [usuario]);
		return respuesta;
	},
	checkIdUser: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT id  FROM usuarios WHERE nombre = ?', [usuario]);
		return respuesta;
	},
	saveUser: async ([usuario, claveEncriptada, email, celu]) => {
		var respuesta = await conexion.query(
			'INSERT INTO usuarios (nombre, clave_encriptada, email, celu) VALUE (?,?,?,?)', [usuario, claveEncriptada, email, celu]);
		return respuesta;
	}
}
