(function shimlibNumberModule() {
	"use strict";

	var shimlibIs = require('shimlib-is');
	var shimlibTimes = require('shimlib-times');

	function shimlibToFixed(n, precision) {
		if (!shimlibIs.isNumber(n)) { return; }
		if (!shimlibIs.isNumber(precision)) {
			precision = 2;
		}

		if (precision === 0) {
			return Number.prototype.toString.call(Math.floor(n));
		}

		if (n === 0) {
			return '0.' + shimlibTimes.timesString('0', precision);
		}

		var nBig = n * Math.pow(10, precision);

		if (n < 0) {
			nBig = Math.ceil(nBig);
		} else {
			nBig = Math.floor(nBig);
		}

		var nBigString = Number.prototype.toString.call(nBig);
		var stringStart = nBigString.substring(0, nBigString.length - precision);
		var stringEnd = nBigString.substring(nBigString.length - precision);

		if (stringStart === '-' || stringStart === '') {
			stringStart += '0';
		}

		return stringStart + '.' + stringEnd;
	}

	var shimlibNumber = {
		toFixed: shimlibToFixed
	};

	module.exports = shimlibNumber;
})();