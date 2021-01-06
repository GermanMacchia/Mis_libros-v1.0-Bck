const usuarioModel = require('../models/usuario.js');

module.exports = {
	verificarNombreUsuario: async (usuario) => {
		var verificarNombreUsuario = await usuarioModel.userNameVerify(usuario);
		return verificarNombreUsuario;
	},
	verClaveUsuario: async (usuario) => {
		var verClaveUsuario = await usuarioModel.checkUserPass(usuario);
		return verClaveUsuario;
	},
	verEmailUsuario: async (usuario) => {
		var verEmailUsuario = await usuarioModel.checkEmailUser(usuario);
		return verEmailUsuario;
	},
	verIdUsuario: async (usuario) => {
		var verIdUsuario = await usuarioModel.checkIdUser(usuario);
		return verIdUsuario;
	}
}

