const conexion = require('../views/db.js');

module.exports = {
    bookVerify: async (nombre) => {
        var respuesta = await conexion.query(
            'SELECT nombre_libro FROM libros WHERE nombre_libro = ?', [nombre]);
        return respuesta;
    },
    bookVerifyId: async (id) => {
        var respuesta = await conexion.query(
            'SELECT * FROM libros WHERE id_libro = ?', [id]);
        return respuesta;
    },
    categoryVerify: async (idCategoria) => {
        var respuesta = await conexion.query(
            'SELECT id_categoria FROM genero WHERE id_categoria = ?', [idCategoria]);
        return respuesta;
    },
    saveNewBook: async ([nombre, descripcion, idCategoria]) => {
        var respuesta = await conexion.query(
            'INSERT INTO libros (nombre_libro, descripcion_libro, id_categoria) VALUE (?,?,?)', [nombre, descripcion, idCategoria]);
        return respuesta;
    },
    seeListBooks: async () => {
        var respuesta = await conexion.query(
            'SELECT * FROM libros');
        return respuesta;
    },
    updateBooks: async ([nombre, descripcion, idCategoria, idPersona, id]) => {
        const query = 'UPDATE libros SET nombre_libro = ?, descripcion_libro = ?, id_categoria = ?, id_persona = ? WHERE id_libro = ?';
        const respuesta = await conexion.query(query, [nombre, descripcion, idCategoria, idPersona, id]);
        return respuesta;
    },
    lendsBooks: async ([idPersona, id]) => {
        query = 'UPDATE libros SET id_persona = ? WHERE id_libro = ?';
        respuesta = await conexion.query(query, [idPersona, id]);
        return respuesta;
    },
    deleteBooks: async ([id]) => {
        query = "DELETE FROM libros WHERE id_libro = ?";
        respuesta = await conexion.query(query, [id]);
    }
}