const conn = require('../conn');
const DATABASE = 'mislibros';
const CATEGORIAS = 'categorias';

module.exports = {
	nombreCategoria: async (nombre) => {
		let respuesta = await conexion.query(
			'SELECT id FROM categorias WHERE nombre = ?', [nombre]);
		return respuesta;
	},
	nuevaCategoria: async (categoria) => {
		let respuesta = await conexion.query(
			'INSERT INTO categorias (nombre, descripcion, imagen) VALUE (?,?,?)', [categoria.nombre, categoria.descripcion, categoria.imagen]);
		return respuesta;
	},
	categoriaId: async (id) => {
		let respuesta = await conexion.query(
			'SELECT * FROM categorias WHERE id = ?', [id]);
		return respuesta;
	},
	listaCategorias: async () => {
		const connectiondb = await conn.getConnection();
		const respuesta = await connectiondb
					.db(DATABASE)
					.collection(CATEGORIAS)
		return respuesta;
	},
	categoriaLibros: async (id) => {
		let respuesta = await conexion.query(
			'SELECT * FROM libros WHERE categoria_id = ?', [id]);
		return respuesta;
	},
	borrarCategoria: async (id) => {
		let respuesta = await conexion.query(
			'DELETE FROM categorias WHERE id = ?', [id]);
		return respuesta;
	},
	resetCategorias: async () => {
		let respuesta = await conexion.query(
			"ALTER TABLE categorias AUTO_INCREMENT = 1");
		return respuesta;
	},
	modificarCategoria: async (categoria) => {
		let respuesta = await conexion.query(
			'UPDATE categorias SET nombre = ? WHERE id = ?',[categoria.nombre, categoria.id]
		);
		return respuesta;
	}
}