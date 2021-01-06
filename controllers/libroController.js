const libroService = require('../services/libroService.js');

module.exports = {
	verificarLibro: async (nombre) => {
		var verificarLibro= await libroService.verificarLibros(nombre);
		return verificarLibro;
	},
	verificacionCategoria: async (idCategoria) => {
		var verificacionCategoria= await libroService.verificarCategoriaId(idCategoria);
		return verificacionCategoria;
	},
	guardarLibro: async ([nombre, descripcion, idCategoria]) => {
		var guardarLibro = await libroService.guardarNuevoLibro([nombre, descripcion, idCategoria]);
		return guardarLibro;
	},
	verLibros: async () => {
		var verLibros = await libroService.verlistaLibros();
		return verLibros;
	}
}