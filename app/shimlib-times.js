(function shimlibTimesModule() {
	"use strict";

	var shimlibIs = require('./shimlib-is');

	function shimlibTimes(fn, numTimes, context) {
		if(!numTimes || numTimes < 1) { return; }

		if(shimlibIs.isString(fn)) {
			return shimlibTimesString(fn, numTimes);
		}

		if(!shimlibIs.isFunction(fn)) {
			return shimlibTimesValue(fn, numTimes);
		}

		for (var k = 0; k < numTimes; k++) {
			fn.apply(context || null);
		}
	}

	//Repeat string 's'
	function shimlibTimesString(s, times) {
		var st = '';

		for (var i = 0; i < times; i++) {
			st = st + s;
		}

		return st;
	}

	//Make an array of length 'times' containing 'val'
	function shimlibTimesValue(val, times) {
		var arr = [];

		for (var i = 0; i < times; i++) {
			arr.push(val);
		}

		return arr;
	}

	module.exports = {
		times: shimlibTimes,
		timesString: shimlibTimesString,
		timesValue: shimlibTimesValue
	};
})();