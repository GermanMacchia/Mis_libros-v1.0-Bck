const libroModel = require('../models/libro.js');

module.exports = {
	verificarLibros: async (nombre) => {
		var verificarLibros = await libroModel.bookVerify(nombre);
		return verificarLibros;
	},
	verificarCategoriaId: async (idCategoria) => {
		var verificarCategoriaId = await libroModel.categoryVerify(idCategoria);
		return vverificarCategoriaId;
	},
	guardarNuevoLibro: async ([nombre, descripcion, idCategoria]) => {
		var guardarNuevoLibro = await libroModel.SaveNewBook([nombre, descripcion, idCategoria]);
		return guardarNuevoLibro;
	}
}