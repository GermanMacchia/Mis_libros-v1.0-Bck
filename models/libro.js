const conn = require('../conn');
const DATABASE = 'mislibros';
const LIBROS = 'libros';

module.exports = {
    nombreLibro: async (nombre) =>{ 
    	const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(LIBROS)
					.findOne({nombre: nombre})

		return respuesta;
    },
    libroId: async (id) => {
        const connectiondb = await conn.getConnection();
		const libro = await connectiondb
					.db(DATABASE)
					.collection(LIBROS)
					.findOne({id: id})
		return libro;
    },
    categoriaId: async (id) => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(CATEGORIAS)
					.findOne({id: id})

		return respuesta.categoria_id;
    },
    personaId: async (id) => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(CATEGORIAS)
					.findOne({id: id})

		return respuesta.persona_id;
    },
    nombreId: async (id) => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(CATEGORIAS)
					.findOne({id: id})

		return respuesta.nombre;
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
                            .find()
                            .toArray()
                    
		return respuesta;
    },
    actualizarLibro: async (libro) => {
        const connectiondb = await conn.getConnection();
        const respuesta = await connectiondb
                            .db(DATABASE)
                            .collection(LIBROS)
                            .updateOne({_id: new objectId(libro._id)}, 
                                        {$set: {nombre: libro.nombre, 
                                                descripcion: libro.descripcion, 
                                                categoria_id: libro.categoria_id,
                                                persona_id: libro.persona_id,
                                                autor: libro.autor,
                                                rating: libro.rating
                                            }});
        return respuesta;
    },
    prestarLibro: async (datos) => {
        const connectiondb = await conn.getConnection();
        const respuesta = await connectiondb
                            .db(DATABASE)
                            .collection(LIBROS)
                            .updateOne({_id: new objectId(datos._id)}, 
                                        {$set: {persona_id: datos.persona_id }});
        return respuesta;
    },
    devolverLibro: async (id) => {
        const connectiondb = await conn.getConnection();
        const respuesta = await connectiondb
                            .db(DATABASE)
                            .collection(LIBROS)
                            .updateOne({_id: new objectId(datos._id)}, 
                                        {$set: {persona_id: null }});
        return respuesta;
    },
    borrarLibro: async (id) => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
                            .db(DATABASE)
                            .collection(CATEGORIAS)
                            .deleteOne({id: id})
		return respuesta;
    }
}