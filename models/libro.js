const conexion = require('../views/db.js');

module.exports = {
	bookVerify: async (nombre) => {
		var respuesta = await conexion.query(
			'SELECT nombre_libro FROM libros WHERE nombre_libro = ?', [nombre]);
		return respuesta;
	},
	categoryVerify: async (idCategoria) => {
		var respuesta = await conexion.query(
			'SELECT id_categoria FROM genero WHERE id_categoria = ?', [idCategoria]);
		return respuesta;
	},
	SaveNewBook: async ([nombre, descripcion, idCategoria]) => {
		var respuesta = await conexion.query(
			'INSERT INTO libros (nombre_libro, descripcion_libro, id_categoria) VALUE (?,?,?)', [nombre, descripcion, idCategoria]);
		return respuesta;
	}

	
}