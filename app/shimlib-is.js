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

    function shimlibIsNan(n) {
		return n !== n;
    }

    function shimlibIsNumber(o) {
		if (shimlibIsNan(o)) { return false; }
		return Object.prototype.toString.call(o) === "[object Number]";
    }

    var shimlibIs = {
		isArray: shimlibIsArray,
		isFunction: shimlibIsFunction,
		isNan: shimlibIsNan,
		isNumber: shimlibIsNumber,
		isString: shimlibIsString
    };

    module.exports = shimlibIs;
})();