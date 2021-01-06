const conexion = require('../views/db.js');

module.exports = {
	userNameVerify: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT * from usuarios WHERE nombre_usuario = ?', [usuario]);
		return respuesta;
	},
	checkUserPass: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT clave_encriptada FROM usuarios WHERE nombre_usuario = ?', [usuario]);
		return respuesta;
	},
	checkEmailUser: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT email_usuario FROM usuarios WHERE nombre_usuario = ?', [usuario]);
		return respuesta;
	},
	checkIdUser: async (usuario) => {
		var respuesta = await conexion.query(
			'SELECT usuario_id  FROM usuarios WHERE nombre_usuario = ?', [usuario]);
		return respuesta;
	}
}
