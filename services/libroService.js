const libroModel = require('../models/libro.js');
const categoriaModel = require('../models/categoria.js')
const personaModel = require('../models/persona.js');

module.exports = {
    nuevoLibro: async (libro) => {
        var respuesta = await libroModel.nombreLibro(libro.nombre);
        if (respuesta) {
            throw new Error('Ese libro ya existe')
        }        

        respuesta = await categoriaModel.categoriaId(libro.categoria_id);
        if (respuesta == null) {
            throw new Error('No existe la categoria indicada')
        }

        if(libro.persona_id != null){
            respuesta = await personaModel.personaId(libro.persona_id);
            if (respuesta.length == 0) {
                throw new Error('No existe la persona indicada')
            }
        }

        respuesta = await libroModel.nuevoLibro(libro);
        return respuesta;
    },

    libroUpdate: async (libro) => {
       
        var respuesta = await libroModel.libroId(libro.id);
        if (respuesta == null) {
            throw new Error('Ese libro no existe')
        }       
         /*
        respuesta = await libroModel.nombreId(libro.id);
        if (respuesta[0].nombre != libro.nombre) {
            throw new Error('No se puede actualizar el nombre, solo se puede modificar la descripcion del libro')
        }
        respuesta = await libroModel.categoriaId(libro.id);
        if (respuesta[0].categoria_id != libro.categoria_id) {
            throw new Error('No se puede actualizar la categoria, solo se puede modificar la descripcion del libro')
        }

        respuesta = await libroModel.personaId(libro.id);
        if (respuesta[0].persona_id != libro.persona_id) {
            throw new Error('No se puede actualizar la persona, solo se puede modificar la descripcion del libro');
        }*/
        console.log({libro: libro, respuesta: respuesta[0]});
        respuesta = await libroModel.actualizarLibro(libro);
        return respuesta;
    },

    prestarLibro: async (datos) => {
        if (datos.id != datos.id_params) {
            throw new Error('los datos de envio no coinciden.')
        }
        var respuesta = await libroModel.libroId(datos.id);
        if (respuesta == null) {
            throw new Error('Ese libro no existe')
        }
        if (respuesta[0].persona_id != null) {
            throw new Error("El libro ya fue prestado");
        }
        respuesta = await personaModel.personaId(datos.persona_id);
        if (respuesta == null) {
            throw new Error('No se encuentra esa persona');
        }
        respuesta = await libroModel.prestarLibro(datos);
        return respuesta;
    },

    devolverLibro: async (id) => {
        var respuesta = await libroModel.libroId(id);
        if (respuesta == null) {
            throw new Error('Ese libro no existe')
        }
        if (respuesta[0].persona_id == null) {
            throw new Error("El libro no esta prestado");
        }
        respuesta = await libroModel.devolverLibro(id)
        return respuesta;
    },

    borrarLibro: async (id) => {
        var respuesta = await libroModel.libroId(id);
        
        if (respuesta == null) {
            throw new Error('Ese libro no existe')
        }
        if (respuesta.persona_id != null) {
            throw new Error(
                "Ese libro esta prestado, no se puede borrar"
            );
        }
        respuesta = await libroModel.borrarLibro(id)
        return respuesta;
    }
}