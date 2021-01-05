const categoriaModel = require('..models/categoria.js')

module.exports = {

	postCategoria: async function(nombre){
		let respuesta = await categoriaModel.verificarCategoria(nombre);

		if (respuesta.length > 0) { 
			throw new Error('Ese nombre de categoria ya existe')
		}

		respuesta = await categoriaModel.guardarCategoria(nombre);

		return {
			Nombre: nombre,
			Id: respuesta.insertId
		}
	};

}
