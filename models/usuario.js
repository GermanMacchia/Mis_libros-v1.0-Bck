const conn = require('../conn');
const DATABASE = 'mislibros';
const USUARIOS = 'usuarios';

module.exports = {
	nombreUsuario: async (nombre) => {
		const connectiondb = await conn.getConnection();
		const usuario = await connectiondb
					.db(DATABASE)
					.collection(USUARIOS)
					.findOne({usuario: nombre})
		return usuario;
	},
	claveUsuario: async (nombre) => {
		const connectiondb = await conn.getConnection();
		const usuario = await connectiondb
					.db(DATABASE)
					.collection(USUARIOS)
					.findOne({usuario: nombre});   
		return usuario.clave;
	},
	emailUsuario: async (nombre) => {
		const connectiondb = await conn.getConnection();
		const usuario = await connectiondb
					.db(DATABASE)
					.collection(USUARIOS)
					.findOne({usuario: nombre})
		return usuario.email;
	},
	idUsuario: async (nombre) => {
		const connectiondb = await conn.getConnection();
		const usuario = await connectiondb
					.db(DATABASE)
					.collection(USUARIOS)
					.findOne({usuario: nombre})
		return usuario._id;
	},
	nuevoUsuario: async (usuario) => {
		const connectiondb = await conn.getConnection();
		const result = await connectiondb
					.db(DATABASE)
					.collection(USUARIOS)
					.insertOne(usuario);
		return result;
	}
}