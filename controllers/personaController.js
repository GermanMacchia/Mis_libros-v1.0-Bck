const personaService = require('../services/personaService.js');
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
        //VALIDACIÓN
        if (!req.body.email || !req.body.apellido|| !req.body.nombre) {
            throw new Error('Faltan datos'); // alias permite null
        }
        if (await trim.conEspacios(req.body.email)||
        	await trim.conEspacios(req.body.apellido)||
        	await trim.conEspacios(req.body.nombre)) {
			throw new Error('Los campos requeridos no pueden permanecer con espacios vacios');
		}
        //STANDARIZACIÓN
        const email = req.body.email.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const nombre = req.body.nombre.toUpperCase();
        const alias = req.body.alias.toUpperCase();
        //VERIFICACIÓN
        let respuesta = await personaController.verificarPersona(email);
        if (respuesta.length > 0) {
            throw new Error('El email ya se encuentra registrado')
        }
        //GUARDAR
        respuesta = await personaController.guardarPersona([nombre, apellido, email, alias]);
        res.status(200).send({
            Id: respuesta.insertId,
            Nombre: nombre,
            Apellido: apellido,
            Email: email,
            Alias: alias
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
        let respuesta = await personaController.verPersonas();
        res.status(200).send({
            respuesta: respuesta
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
        let respuesta = await personaController.verPersonaId(id);
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

app.put('/persona/:id', async(req, res) => {
    try {
        let id = req.params.id;
        if (await trim.conEspacios(req.body.email)||
        	await trim.conEspacios(req.body.apellido)||
        	await trim.conEspacios(req.body.nombre)) {
			throw new Error('Los campos requeridos no pueden permanecer vacios');
		}
        //STANDARIZACIÓN
        let email = req.body.email.toUpperCase();
        let apellido = req.body.apellido.toUpperCase();
        let nombre = req.body.nombre.toUpperCase();
        let alias = req.body.alias.toUpperCase();
        //VERIFICACIÓN
        let respuesta = await personaController.verificacionDoble([email, id]);
        if (respuesta.length < 1) {
            throw new Error('El email no se puede modificar');
        }
        //INSERCIÓN
        respuesta = await personaController.actualizarPersona([nombre, apellido, alias, id]);
        res.status(200).send({
            Nombre: nombre,
            Apellido: apellido,
            Email: email,
            Alias: alias
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
        //VERIFICACIÓN
        let id = req.params.id;
        let respuesta = await personaController.verPersonaId(id);
        if (respuesta.length == 0) {
            throw new Error("Esta persona no se encuentra registrada");
        }
        //CHEQUEO EN LIBROS **********
        respuesta = await personaController.chequeoLibrosPersona(id);
        if (respuesta.length > 0) {
            throw new Error(
                "Esta persona tiene libros asociados, no se puede eliminar"
            );
        }
        //BORRAR
        respuesta = await personaController.borrarPersona(id);
        res.status(200).send({
            respuesta: "Se borro correctamente",
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

module.exports = app;