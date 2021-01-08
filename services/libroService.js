const libroModel = require('../models/libro.js');

module.exports = {
    verificarLibros: async (nombre) => {
        var verificarLibros = await libroModel.bookVerify(nombre);
        return verificarLibros;
    },
    verificarLibrosId: async (id) => {
        var verificarLibrosId = await libroModel.bookVerifyId(id);
        return verificarLibrosId;
    },
    verificarCategoriaId: async (idCategoria) => {
        var verificarCategoriaId = await libroModel.categoryVerify(idCategoria);
        return verificarCategoriaId;
    },
    guardarNuevoLibro: async ([nombre, descripcion, idCategoria]) => {
        var guardarNuevoLibro = await libroModel.saveNewBook([nombre, descripcion, idCategoria]);
        return guardarNuevoLibro;
    },
    verlistaLibros: async () => {
        var verlistaLibros = await libroModel.seeListBooks();
        return verlistaLibros;
    },
    actualizarLibro: async ([nombre, descripcion, idCategoria, idPersona, id]) => {
        const actualizarLibro = await libroModel.updateBooks([nombre, descripcion, idCategoria, idPersona, id]);
        return actualizarLibro;
    },
    prestarLibro: async ([idPersona, id]) => {
        const prestarLibro = await libroModel.lendsBooks([idPersona, id]);
        return prestarLibro;
    },
    borrarLibro: async ([id]) => {
        const borrarlibro = await libroModel.deleteBooks([id]);
        return borrarlibro;
    }

}