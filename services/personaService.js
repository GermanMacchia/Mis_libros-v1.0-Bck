const personaModel = require('../models/persona.js');

module.exports = {
	nuevaPersona: async (persona) => {
        var respuesta = await personaModel.mailPersona(persona.email);
        if (respuesta) {
            throw new Error('El email ya se encuentra registrado')
        }
 
        respuesta = await personaModel.guardarPersona(persona)
        return respuesta;
	},

	actualizarPersona: async (persona) => {
		var respuesta = await personaModel.personaId(persona.id_params);
		if (respuesta == null) {
            throw new Error('La persona no existe');
        }

        respuesta = await personaModel.personaUpdate(persona);
        return respuesta;
	},

	borrarPersona: async (id) => {
        var respuesta = await personaModel.personaId(id);
        if (respuesta == null) {
            throw new Error("Esta persona no se encuentra registrada");
        }

        respuesta = await personaModel.librosPersona(id);
        if (respuesta) {
            throw new Error(
                "Esta persona tiene libros asociados, no se puede eliminar"
            );
        }

        respuesta = await personaModel.borrarPersona(id);
        return respuesta;
	}
}