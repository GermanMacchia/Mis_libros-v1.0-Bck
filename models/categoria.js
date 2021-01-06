const conexion = require('../views/db.js');

module.exports = {
	saveCategory: async (nombre) => {
		var respuesta = await conexion.query(
			'INSERT INTO genero (nombre_categoria) VALUE (?)', [nombre]);
		return respuesta;
	},
	checkCategory: async (nombre) => {
		var respuesta = await conexion.query(
			'SELECT id_categoria FROM genero WHERE nombre_categoria = ?', [nombre]);
		return respuesta;
	},
	checkCategoryId: async (id) => {
		var respuesta = await conexion.query(
			'SELECT * FROM genero WHERE id_categoria = ?', [id]);
		return respuesta;
	},
	listCategories: async () => {
		var respuesta = await conexion.query(
			'SELECT * FROM genero');
		return respuesta;
	},
	idCategory: async (id) => {
		var respuesta = await conexion.query(
			'SELECT * FROM genero WHERE id_categoria = ?', [id]);
		return respuesta;
	},
	checkBooksCategory: async (id) => {
		var respuesta = await conexion.query(
			'SELECT * FROM libros WHERE id_categoria = ?', [id]);
		return respuesta;
	},
	deleteCategory: async (id) => {
		var respuesta = await conexion.query(
			'DELETE FROM genero WHERE id_categoria = ?', [id]);
		return respuesta;
	}
}