(function shimlibNumberModule() {
	"use strict";

	var shimlibIs = require('./shimlib-is');
	var shimlibTimes = require('./shimlib-times');

	function shimlibToFixed(n, precision) {
		if (shimlibIs.isNan(n)) {
			return "NaN";
		}

		if (!shimlibIs.isNumber(n)) {
			throw new TypeError('n must be a number or NaN');
		}

		if (!shimlibIs.isNumber(precision) || precision === 0) {
			return Number.prototype.toString.call(Math.floor(n));
		}

		if (n === 0) {
			return '0.' + shimlibTimes.timesString('0', precision);
		}

		var sign = n < 0 ? '-' : '';

		// Multiply n by 10^precision.
		// (Move n to the left of the decimal by precision places).
		// Truncate into an integer, and turn that into a string.
		// Insert a new decimal point precision places from the right of the string.
		// If n is negative, prepend '-'.
		var nBig = Math.abs(n) * Math.pow(10, precision);
		nBig = Math.floor(nBig);

		var nBigString = Number.prototype.toString.call(nBig);
		var sBeforeDecimal = nBigString.substring(0, nBigString.length - precision);
		var sAfterDecimal = nBigString.substring(nBigString.length - precision);

		// Add a leading 0 before decimal values with a
		// magnitude less than 1
		if (sBeforeDecimal === '') {
			sBeforeDecimal = '0';
		}

		return sign + sBeforeDecimal + '.' + sAfterDecimal;
	}

	var shimlibNumber = {
		toFixed: shimlibToFixed
	};

	module.exports = shimlibNumber;
})();