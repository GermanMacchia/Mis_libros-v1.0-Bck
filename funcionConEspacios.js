
module.exports = {
	conEspacios: function (campo) {
		if (campo.trim().length == 0) {
			return true;
		} else {
			return false;
		}
	}
}