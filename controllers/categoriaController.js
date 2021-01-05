const categoriaService = require('../services/categoriaService.js');

module.exports = {
	postCategoria: async (nombre) =>{
		var nuevaCategoria = await categoriaService.postCategoria(nombre);
		return nuevaCategoria;
	},
	verificarCategoria: async(nombre) =>{
		var verificacion = await categoriaService.verificarCategoria(nombre);
		return verificacion;
	}
}