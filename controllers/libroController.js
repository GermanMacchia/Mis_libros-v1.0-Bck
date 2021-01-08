const libroService = require('../services/libroService.js');

module.exports = {
    verificarLibro: async(nombre) => {
        var verificarLibro = await libroService.verificarLibros(nombre);
        return verificarLibro;
    },
    verificarLibroId: async(id) => {
        var verificarLibroId = await libroService.verificarLibrosId(id);
        return verificarLibroId;
    },
    verificacionCategoria: async(idCategoria) => {
        var verificacionCategoria = await libroService.verificarCategoriaId(idCategoria);
        return verificacionCategoria;
    },
    guardarLibro: async([nombre, descripcion, idCategoria]) => {
        var guardarLibro = await libroService.guardarNuevoLibro([nombre, descripcion, idCategoria]);
        return guardarLibro;
    },
    verLibros: async() => {
        var verLibros = await libroService.verlistaLibros();
        return verLibros;
    },
    actualizarLibro: async([nombre, descripcion, idCategoria, idPersona, id]) => {
        const actualizarLibro = await libroService.actualizarLibro([nombre, descripcion, idCategoria, idPersona, id]);
        return actualizarLibro;
    },
    prestarLibro: async([idPersona, id]) => {
        const prestarLibro = await libroService.prestarLibro([idPersona, id]);
        return prestarLibro;
    },
    borrarLibro: async([id]) => {
        const borrarlibro = await libroService.borrarLibro([id]);
        return borrarlibro;
    }
}