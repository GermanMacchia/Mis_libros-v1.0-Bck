const conexion = require('../views/db.js');

module.exports = {

	guardarCategoria: async (nombre) => {
		var respuesta = await conexion.query(
			'INSERT INTO genero (nombre_categoria) VALUE (?)', [nombre]);
		return respuesta;
	},

	verificarCategoria: async (nombre) => {

		var respuesta = await conexion.query(
			'SELECT id_categoria FROM genero WHERE nombre_categoria = ?', [nombre]);
			return respuesta
			console.log('respuesta')
	}
}