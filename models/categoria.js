const conexion = require('../db.js');

module.exports = {
	saveCategory: async (nombre) => {
		var respuesta = await conexion.query(
			'INSERT INTO categorias (nombre) VALUE (?)', [nombre]);
		return respuesta;
	},
	checkCategory: async (nombre) => {
		var respuesta = await conexion.query(
			'SELECT id FROM categorias WHERE nombre = ?', [nombre]);
		return respuesta;
	},
	categoriaId: async (id) => {
		var respuesta = await conexion.query(
			'SELECT * FROM categorias WHERE id = ?', [id]);
		return respuesta;
	},
	listCategories: async () => {
		var respuesta = await conexion.query(
			'SELECT * FROM categorias');
		return respuesta;
	},
	idCategory: async (id) => {
		var respuesta = await conexion.query(
			'SELECT * FROM categorias WHERE id = ?', [id]);
		return respuesta;
	},
	checkBooksCategory: async (id) => {
		var respuesta = await conexion.query(
			'SELECT * FROM libros WHERE id = ?', [id]);
		return respuesta;
	},
	deleteCategory: async (id) => {
		var respuesta = await conexion.query(
			'DELETE FROM categorias WHERE id = ?', [id]);
		return respuesta;
	}
}