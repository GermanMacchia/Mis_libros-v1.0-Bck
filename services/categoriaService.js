const categoriaModel = require('../models/categoria.js')

module.exports = {
	nuevaCategoria: async (nombre) => {
		var respuesta = await categoriaModel.nombreCategoria(nombre);
		if (respuesta.length > 0) {
			throw new Error('Categoria Existente');
		}

		respuesta = await categoriaModel.nuevaCategoria(nombre);
		return respuesta;
	},

	borrarCategoria: async (id) => {
		var respuesta = await categoriaModel.categoriaId(id);
		if (respuesta.length == 0) {
			throw new Error("Esta categoria no existe");
		}

		respuesta = await categoriaModel.categoriaLibros(id);
		if (respuesta.length > 0) {
			throw new Error("Esta categoria tiene libros asociados, no se puede eliminar");
		}

		respuesta = await categoriaModel.borrarCategoria(id)
		return respuesta;
	}

}