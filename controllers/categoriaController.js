const categoriaService = require('../services/categoriaService.js');

module.exports = {
    postCategoria: async (nombre) => {
        var nuevaCategoria = await categoriaService.postCategoria(nombre);
        return nuevaCategoria;
    },
    verificarCategoria: async (nombre) => {
        var verificacion = await categoriaService.verificarCategoria(nombre);
        return verificacion;
    },
    verificarCategoriaID: async (id) => {
        var verificacion = await categoriaService.verificarCategoriaId(id);
        return verificacion;
    },
    verCategorias: async () => {
        var listaCategorias = await categoriaService.mostrarCategorias();
        return listaCategorias;
    },
    verCategoriaId: async (id) => {
        var verCategoria = await categoriaService.verCategoriaID(id);
        return verCategoria;
    },
    chequeoLibrosCategoria: async (id) => {
        var chequeoLibrosCategoria = await categoriaService.chequeoLibrosID(id)
        return chequeoLibrosCategoria;
    },
    borrarCategoria: async (id) => {
        var borrarCategoria = await categoriaService.borrarCategoriaID(id)
        return borrarCategoria;
    }
}