const personaModel = require('../models/persona.js');

module.exports = {
	verificarEmPersona: async (email) => {
		var verificarEmPersona = await personaModel.personVerify(email);
		return verificarEmPersona;
	},
	guardarNuePersona: async ([nombre, apellido, email, alias]) => {
		var guardarNuePersona = await personaModel.saveNewPerson([nombre, apellido, email, alias]);
		return guardarNuePersona;
	},
	verListaPersona: async () => {
		var verListaPersona = await personaModel.seePersonList();
		return verListaPersona;
	},
	verPersonaID: async (id) => {
		var verPersonaID = await personaModel.seePersonId(id);
		return verPersonaID;
	},
	verifDoble: async ([email, id]) => {
		var verifDoble = await personaModel.doubleCheck([email, id]);
		return verifDoble; 
	},
	actulizarPer: async ([nombre, apellido, alias, id]) => {
		var actulizarPer = await personaModel.updatePerson([nombre, apellido, alias, id]);
		return actulizarPer;	
	},
	prestamoPersona: async (id) => {
		var prestamoPersona = await personaModel.bookPerson(id);
		return prestamoPersona;
	},
	borraPersona: async (id) => {
		var borraPersona = await personaModel.deletePerson(id);
		return borraPersona;
	}
}