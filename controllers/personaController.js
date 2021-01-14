const personaService = require('../services/personaService.js');
const personaModel = require('../models/persona.js');
const trim = require('../funcionConEspacios.js'); //funcion para evitar campos vacios 
const express = require('express');
const app = express.Router();

//PERSONA----------------------------------------------------------

/* 5 - Post <<<<<<<<<<<<<<<<<<

'/persona' recibe: {nombre: string, apellido: string, alias: string, 
email: string} retorna: status: 200, {id: numerico, nombre: string, 
apellido: string, alias: string, email: string} - status: 413, 
{mensaje: <descripcion del error>} que puede ser: "faltan datos", 
"el email ya se encuentra registrado", "error inesperado" */

app.post('/persona', async(req, res) => {
    try {
        if (!req.body.email || 
            !req.body.apellido|| 
            !req.body.nombre||
            !req.body.alias) {
            throw new Error('Faltan datos'); 
        }
        if (trim.conEspacios(req.body.email)||
        	trim.conEspacios(req.body.apellido)||
        	trim.conEspacios(req.body.nombre)||
            trim.conEspacios(req.body.alias)) {
			throw new Error('Los campos requeridos no pueden permanecer con espacios vacios');
		}

        let persona = {
            email: req.body.email.toUpperCase(),
            apellido: req.body.apellido.toUpperCase(),
            nombre: req.body.nombre.toUpperCase(),
            alias: req.body.alias.toUpperCase()
        }

        let respuesta = await personaService.nuevaPersona(persona);
        res.status(200).send({
            Id: respuesta.insertId,
            Nombre: persona.nombre,
            Apellido: persona.apellido,
            Email: persona.email,
            Alias: persona.alias
        });
    } catch (e) {
        // statements
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 6 - Get <<<<<<<<<<<<<<<<<< 

'/persona' retorna status 200 y [{id: numerico, nombre: string, apellido: 
string, alias: string, email; string}] o bien status 413 y [] */

app.get('/persona', async(req, res) => {
    try {
        let respuesta = await personaModel.listaPersonas();
        res.status(200).send({
            respuesta
        });
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});


/* 7 - Get ID <<<<<<<<<<<<<<<<<<

'/persona/:id' retorna status 200 y {id: numerico, nombre: string, 
apellido: string, alias: string, email; string} - status 413,
 {mensaje: <descripcion del error>} "error inesperado", 
 "no se encuentra esa persona" */

app.get('/persona/:id', async(req, res) => {
    try {
        let id = req.params.id;

        let respuesta = await personaModel.personaId(id);
        if (respuesta.length == 0) {
            throw new Error('No se encuentra esa persona');
        }
        res.status(200).send({
            respuesta: respuesta
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 8 - Put ID <<<<<<<<<<<<<<<<<<

'/persona/:id' recibe: {nombre: string, apellido: string, alias: string, 
email: string} el email no se puede modificar. 
retorna status 200 y el objeto modificado o bien status 413, 
{mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa 
persona" */

app.put('/persona/:id', async (req, res) => {
    try {
        if (trim.conEspacios(req.body.email) ||
            trim.conEspacios(req.body.apellido) ||
            trim.conEspacios(req.body.nombre)||
            trim.conEspacios(req.body.alias)) {
            throw new Error('Los campos requeridos no pueden permanecer vacios');
        }
        let persona = {
            email: req.body.email.toUpperCase(),
            apellido: req.body.apellido.toUpperCase(),
            nombre: req.body.nombre.toUpperCase(),
            alias: req.body.alias.toUpperCase(),
            id_params: req.params.id
        }

        respuesta = await personaService.actualizarPersona(persona);
        console.log(respuesta)
        res.status(200).send({
            Nombre: persona.nombre,
            Apellido: persona.apellido,
            Email: persona.email,
            Alias: persona.alias
        })
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 9 - Delete ID <<<<<<<<<<<<<<<<<<
'/persona/:id' retorna: 200 y {mensaje: "se borro correctamente"} o 
bien 413, {mensaje: <descripcion del error>} "error 
inesperado", "no existe esa persona", "esa persona tiene libros asociados, 
no se puede eliminar" */

app.delete("/persona/:id", async(req, res) => {
    try {
        let id = req.params.id
        let respuesta = await personaService.borrarPersona(id);
        res.status(200).send({
            respuesta: "Se borro correctamente"
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

module.exports = app;