const personaService = require('../services/personaService.js');

module.exports = {
	verificarPersona: async (email) => {
		var verificarPersona = await personaService.verificarEmPersona(email);
		return verificarPersona;
	},
	guardarPersona: async ([nombre, apellido, email, alias]) => {
		var guardarPersona = await personaService.guardarNuePersona([nombre, apellido, email, alias]);
		return guardarPersona;
	},
	verPersonas: async () => {
		var verPersonas = await personaService.verListaPersona();
		return verPersonas;
	},
	verPersonaId: async (id) => {
		var verPersonaId = await personaService.verPersonaID(id);
		return verPersonaId;
	},
	verificacionDoble: async ([email, id]) => {
		var verificacionDoble = await personaService.verifDoble([email, id]);
		return verificacionDoble;
	},
	actualizarPersona: async ([nombre, apellido, alias, id]) => {
		var actualizarPersona = await personaService.actulizarPer([nombre, apellido, alias, id]);
		return actualizarPersona;
	},
	chequeoLibrosPersona: async (id) => {
		var chequeoLibrosPersona = await personaService.prestamoPersona(id);
		return chequeoLibrosPersona;
	},
	borrarPersona: async (id) => {
		var borrarPersona = await personaService.borraPersona(id);
		return borrarPersona;
	}
}