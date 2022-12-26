const conn = require('../conn');
const DATABASE = 'mislibros';
const LIBROS = 'libros';

module.exports = {
    nombreLibro: async (nombre) => {
        let respuesta = await conexion.query(
            'SELECT nombre FROM libros WHERE nombre = ?', [nombre]);
        return respuesta;
    },
    libroId: async (id) => {
        const connectiondb = await conn.getConnection();
		const libro = await connectiondb
					.db(DATABASE)
					.collection(LIBROS)
					.findOne({_id: id})
		return libro;
    },
    categoriaId: async (id) => {
        let respuesta = await conexion.query(
            'SELECT categoria_id FROM libros WHERE id = ?', [id]);
        return respuesta;
    },
    personaId: async (id) => {
        let respuesta = await conexion.query(
            'SELECT persona_id FROM libros WHERE id = ?', [id]);
        return respuesta;
    },
    nombreId: async (id) => {
        let respuesta = await conexion.query(
            'SELECT nombre FROM libros WHERE id = ?', [id]);
        return respuesta;
    },
    nuevoLibro: async (libro) => {
		const connectiondb = await conn.getConnection();
		const result = await connectiondb
					.db(DATABASE)
					.collection(LIBROS)
					.insertOne(libro);
		return result;
    },
    listaLibros: async () => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(LIBROS)
		return respuesta;
    },
    actualizarLibro: async (libro) => {
        let respuesta = await conexion.query('UPDATE libros SET nombre = ?, descripcion = ?, categoria_id = ?, persona_id = ?, autor = ?, rating = ? WHERE id = ?', [libro.nombre, libro.descripcion, libro.categoria_id, libro.persona_id, libro.autor, libro.rating, libro.id]);
        return respuesta;
    },
    prestarLibro: async (datos) => {
        let respuesta = await conexion.query('UPDATE libros SET persona_id = ? WHERE id = ?', [datos.persona_id, datos.id]);
        return respuesta;
    },
    devolverLibro: async (id) => {
        let respuesta = await conexion.query('UPDATE libros SET persona_id = ? WHERE id = ?', [null, id]);
        return respuesta;
    },
    borrarLibro: async (id) => {
        let respuesta = await conexion.query("DELETE FROM libros WHERE id = ?", [id]);
    }
}