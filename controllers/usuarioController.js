const usuarioService = require('../services/usuarioService.js');
const trim = require('../funcionConEspacios.js'); //funcion para evitar campos vacios 
const express = require('express');
const bcrypt = require('bcrypt');
const app = express.Router();

 
app.post('/registro', async(req, res) => {
    try {
        if (!req.body.usuario || 
            !req.body.clave || 
            !req.body.email || 
            !req.body.celu) {
            throw new Error('No enviaste todos los datos necesarios');
        }
        if (trim.conEspacios(req.body.usuario) ||
            trim.conEspacios(req.body.clave) ||
            trim.conEspacios(req.body.email)||
            trim.conEspacios(req.body.celu)) {
            throw new Error('Los campos requeridos no pueden permanecer vacios');
        }

        const claveEncriptada = await bcrypt.hash(req.body.clave, 10);
        let usuario = {
            "usuario": req.body.usuario,
            "email": req.body.email.toUpperCase(),
            "clave": claveEncriptada,
            "celu": req.body.celu
        }

        let respuesta = await usuarioService.registro(usuario);

        res.send({ message: "Se registro correctamente" }); 
    } catch (e) {
        res.status(413).send({ message: e });
    }
});


app.post('/login', async(req, res) => {
    try {
        if (!req.body.user ||
            !req.body.pass) {
            throw new Error('No mandaste todos los datos')
        }

        let usuario = {
            "user": req.body.user,
            "pass": req.body.pass
        }
        let respuesta = await usuarioService.login(usuario);
        
        res.send({
            token: respuesta
        });
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: e.message
        })
    }
});

module.exports = app;