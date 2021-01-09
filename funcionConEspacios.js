
module.exports = {
	conEspacios: async function (campo) {
		if (campo.trim().length == 0) {
			return true;
		} else {
			return false;
		}
	}
}