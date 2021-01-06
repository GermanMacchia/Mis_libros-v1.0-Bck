const usuarioService = require('../services/usuarioService.js');

module.exports = {
	nombreUsuario: async (usuario) => {
		var nombreUsuario = await usuarioService.verificarNombreUsuario(usuario);
		return nombreUsuario;
	},
	claveUsuario: async (usuario) => {
		var claveUsuario = await usuarioService.verClaveUsuario(usuario);
		return claveUsuario;
	},
	emailUsuario: async (usuario) => {
		var emailUsuario = await usuarioService.verEmailUsuario(usuario);
		return emailUsuario;
	},
	idUsuario: async (usuario) => {
		var idUsuario = await usuarioService.verIdUsuario(usuario);
		return idUsuario;
	},
	guardarUsuario: async ([usuario, claveEncriptada, email, celu]) => {
		var guardarUsuario = await usuarioService.guardarNuevoUsuario([usuario, claveEncriptada, email, celu]);
		return guardarUsuario;
	}
}