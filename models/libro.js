const conexion = require('../db.js');

module.exports = {
    bookVerify: async (nombre) => {
        var respuesta = await conexion.query(
            'SELECT nombre FROM libros WHERE nombre = ?', [nombre]);
        return respuesta;
    },
    bookVerifyId: async (id) => {
        var respuesta = await conexion.query(
            'SELECT * FROM libros WHERE id = ?', [id]);
        return respuesta;
    },
    categoryVerify: async (idCategoria) => {
        var respuesta = await conexion.query(
            'SELECT id FROM categorias WHERE id = ?', [idCategoria]);
        return respuesta;
    },
    saveNewBook: async ([nombre, descripcion, idCategoria]) => {
        var respuesta = await conexion.query(
            'INSERT INTO libros (nombre, descripcion, categoria_id) VALUE (?,?,?)', [nombre, descripcion, idCategoria]);
        return respuesta;
    },
    seeListBooks: async () => {
        var respuesta = await conexion.query(
            'SELECT * FROM libros');
        return respuesta;
    },
    updateBooks: async ([nombre, descripcion, idCategoria, idPersona, id]) => {
        const query = 'UPDATE libros SET nombre = ?, descripcion = ?, categoria_id = ?, persona_id = ? WHERE id = ?';
        const respuesta = await conexion.query(query, [nombre, descripcion, idCategoria, idPersona, id]);
        return respuesta;
    },
    lendsBooks: async ([idPersona, id]) => {
        let query = 'UPDATE libros SET persona_id = ? WHERE id = ?';
        respuesta = await conexion.query(query, [idPersona, id]);
        return respuesta;
    },
    deleteBooks: async ([id]) => {
        query = "DELETE FROM libros WHERE id = ?";
        respuesta = await conexion.query(query, [id]);
    }
}