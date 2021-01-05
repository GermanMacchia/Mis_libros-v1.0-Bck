const categoriaModel = require('../models/categoria.js')

module.exports = {

	postCategoria: async (nombre) => {
		var resultado = await categoriaModel.guardarCategoria(nombre);
		return resultado;
	},

	verificarCategoria: async(nombre) =>{
		var resultado = await categoriaModel.verificarCategoria(nombre);
		return resultado;
	}

}
