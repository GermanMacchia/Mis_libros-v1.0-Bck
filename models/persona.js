const conn = require('../conn');
const DATABASE = 'mislibros';
const PERSONAS = 'personas';

module.exports = {
	mailPersona: async (email) => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(PERSONAS)
					.findOne({email: email})
		return respuesta;		
	},
	guardarPersona: async (persona) => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(PERSONAS)
					.insertOne(persona);
		return respuesta;
	},
	listaPersonas: async () => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(PERSONAS)
					.find()
                    			.toArray()				
		return respuesta;
	},
	personaId: async (id) => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(PERSONAS)
					.findOne({id: id})
		return respuesta;
	},
	verificacionDoble: async (persona) => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(PERSONAS)
					.find({email: persona.email, id: persona.id_params})				
		return respuesta;
	},
	personaUpdate: async (persona) => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(CATEGORIAS)
					.updateOne({id: persona.id_params}, {$set: {nombre: persona.nombre, apellido: persona.apellido, alias: persona.alias }});
		return respuesta;
	},
	librosPersona: async (id) => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection("libros")
					.find({persona_id: id})
					.toArray()
		return respuesta;
	},
	borrarPersona: async (id) => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
                            .db(DATABASE)
                            .collection(PERSONAS)
                            .deleteOne({id: id})
		return respuesta;
	},
	/*
	resetPersonas: async () => {
	let respuesta = await conexion.query(
		"ALTER TABLE personas AUTO_INCREMENT = 1");
	return respuesta;
	}*/
}