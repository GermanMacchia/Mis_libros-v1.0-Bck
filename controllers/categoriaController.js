const categoriaService = require('../services/categoriaService.js');
const trim = require('../funcionConEspacios.js'); //funcion para evitar campos vacios 
const express = require('express');
const app = express.Router();



// CATEGORIA --------------------------------------------------------


/* 1 - Post <<<<<<<<<<<<<<<<<< 

Categoria recibe: {nombre:sting} retorna status 200{id: numerico, nombre:string} - 
status 413, {mensaje: <descripcion del error> que puede ser:
"faltan datos", "ese nombre de categoria ya existe", "error inesperado" **/

app.post('/categoria', async(req, res) => {

    try {
        //VALIDACIÓN
        if (!req.body.nombre) {
            throw new Error('Falta enviar el nombre');
        }
        if (await trim.conEspacios(req.body.nombre)) {
            throw new Error('Los campos requeridos no pueden permanecer con espacios vacios');
            //Si no hay contenido en JSON "nombre" en el body tira error
        }
        //STANDARIZACIÓN
        let nombre = req.body.nombre.toUpperCase();
        //VERIFICACIÓN
        let respuesta = await categoriaController.verificarCategoria(nombre)
        if (respuesta.length > 0) {
            throw new Error('Categoria Existente');
        }
        //INSERCIÓN
        respuesta = await categoriaController.postCategoria(nombre);
        res.status(200).send({
            Nombre: nombre,
            Id: respuesta.insertId
        });
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 2 - Get CATEGORIA <<<<<<<<<<<<<<<<<<

'/categoria' retorna: status 200  y [{id:numerico, nombre:string}]  
- status: 413 y [] */

app.get('/categoria', async(req, res) => {
    try {
        let respuesta = await categoriaController.verCategorias();
        res.status(200).send({
            respuesta // Devuelve JSON 
        });
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

/* 3 - Get ID <<<<<<<<<<<<<<<<<<

'/categoria/:id' retorna: status 200 y {id: numerico, nombre:string} - 
status: 413, {mensaje: <descripcion del error>} que puede 
ser: "error inesperado", "categoria no encontrada" */

app.get('/categoria/:id', async(req, res) => {
    try {
        let id = req.params.id;
        let respuesta = await categoriaController.verCategoriaId(id);
        res.status(200).send({
            respuesta
        });
    } catch (e) {
        console.log(e.message);
        res.status(413).send({
            error: 'Error inesperado'
        });
    }
});

/* 4 - Delete <<<<<<<<<<<<<<<<<<

'/categoria/:id' retorna: status 200 y {mensaje: "se borro correctamente"} 
- status: 413, {mensaje: <descripcion del error>} que puese ser: "error inesperado", 
"categoria con libros asociados, no se puede eliminar", "no existe la categoria 
indicada" */

app.delete('/categoria/:id', async(req, res) => {
    try {
        //VERIFICACIÓN
        let id = req.params.id;
        let respuesta = await categoriaController.verificarCategoriaID(id);
        if (respuesta.length == 0) {
            throw new Error("Esta categoria no existe");
        }
        //CHEQUEO DE LIBROS ASOCIADOS
        respuesta = await categoriaController.chequeoLibrosCategoria(id);
        if (respuesta.length > 0) {
            throw new Error("Esta categoria tiene libros asociados, no se puede eliminar");
        }
        //BORRAR CATEGORIA
        respuesta = await categoriaController.borrarCategoria(id)
        console.log(respuesta)
        res.status(200).send({
            respuesta: 'Se borro correctamente la categoria'
        });
    } catch (e) {
        console.error(e.message);
        res.status(413).send({
            error: e.message
        });
    }
});

module.exports = app;