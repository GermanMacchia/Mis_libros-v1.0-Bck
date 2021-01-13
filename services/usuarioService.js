const usuarioModel = require('../models/usuario.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
	login: async (usuario) => {

        let respuesta = await usuarioModel.nombreUsuario(usuario.user);
        if (respuesta.length == 0) { // Si no me arroja ningun resultado entonces el query esta vacio
            throw new Error('El nombre de usuario no esta registrado')
        };
       
        respuesta = await usuarioModel.claveUsuario(usuario.user);
        let passverify = bcrypt.compareSync(usuario.pass, respuesta[0].clave_encriptada)
        if (passverify == false) {
            throw new Error('Contraseña incorrecta')
        };
        
        let email = await usuarioModel.emailUsuario(usuario.user);
        let id = await usuarioModel.idUsuario(usuario.user);
        const tokenData = {
            nombre: usuario.user,
            email: email,
            user_id: id
        };
        const token = jwt.sign(tokenData, 'Secret', { // Se utiliza una palabra determinada para codificar el token
            expiresIn: 60 * 60 * 24 // en este caso, expira en 24hs
        });

        return token;
	},

	registro: async (usuario) => {

        let respuesta = await usuarioModel.nombreUsuario(usuario.usuario);
        if (respuesta.length > 0) {
            throw new Error('Nombre de Usuario existente')
        }
        
        respuesta = await usuarioModel.nuevoUsuario(usuario);

        return respuesta;
	}
}

