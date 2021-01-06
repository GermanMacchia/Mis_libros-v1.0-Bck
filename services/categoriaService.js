const categoriaModel = require('../models/categoria.js')

module.exports = {
	postCategoria: async (nombre) => {
		var resultado = await categoriaModel.saveCategory(nombre);
		return resultado;
	},
	verificarCategoria: async(nombre) => {
		var resultado = await categoriaModel.checkCategory(nombre);
		return resultado;
	},
	verificarCategoriaId: async(id) => {
		var resultado = await categoriaModel.checkCategoryId(id);
		return resultado;
	},
	mostrarCategorias: async() => {
		var resultado = await categoriaModel.listCategories();
		return resultado;
	},
	verCategoriaID: async(id) => {
		var resultado = await categoriaModel.idCategory(id);
		return resultado;
	},
	chequeoLibrosID: async (id) => {
		var resultado = await categoriaModel.checkBooksCategory(id);
		return resultado;
	},
	borrarCategoriaID: async(id) => {
		var resultado = await categoriaModel.deleteCategory(id);
		return resultado;
	}
}
