(function shimlibIsModule() {
	"use strict";

	function shimlibIsString(o) {
		return typeof o === "string" || o instanceof String;
	}

	function shimlibIsFunction(f) {
		return typeof f === "function";
	}

	function shimlibIsArray(o) {
		if (typeof o !== 'object') { return false;}

        return Object.prototype.toString.call(o) === "[object Array]";
    }

    function shimlibIsNumber(o) {
		return Object.prototype.toString.call(o) === "[object Number]";
    }

    var shimlibIs = {
		isArray: shimlibIsArray,
		isFunction: shimlibIsFunction,
		isNumber: shimlibIsNumber,
		isString: shimlibIsString
    };

    module.exports = shimlibIs;
})();