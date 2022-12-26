const categoriaModel = require('../models/categoria.js')

module.exports = {
	nuevaCategoria: async (categoria) => {
		var respuesta = await categoriaModel.nombreCategoria(categoria.nombre);
		if (respuesta) {
			throw new Error('Categoria Existente');
		}

		respuesta = await categoriaModel.nuevaCategoria(categoria);
		return respuesta;
	},

	modificarCategoria: async (categoria) => {
		var respuesta = await categoriaModel.nombreCategoria(categoria.nombre);
		if (respuesta.length > 0) {
			throw new Error('Categoria Existente');
		}

		respuesta = await categoriaModel.categoriaLibros(categoria.id);
		if (respuesta.length > 0) {
			throw new Error("Esta categoria tiene libros asociados, no se puede modificar");
		}

		respuesta = await categoriaModel.modificarCategoria(categoria);
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
	},

	categoriaID: async (id) => {
		var respuesta = await categoriaModel.categoriaId(id);
		if (respuesta.length < 1) {
			throw new Error("Esta categoria no existe");
		}
		return respuesta;
	}

}