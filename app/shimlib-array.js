(function shimlibArrayModule() {
	"use strict";

	var _undefined = void 0;

	var shimlibIs = require('./shimlib-is');

	function shimlibFilter(arr, fn, thisArg) {
		if (!fn) { return; }
		arr = arr || [];
		var result = [];
		var thisObj = thisArg || arr;
		var len = arr.length;

		for (var i = 0; i < len; i++) {
			if (!Object.prototype.hasOwnProperty.call(arr, i)) { continue; }
			var currentResult = fn.call(thisObj, arr[i], i, arr);
			if (!!currentResult) {
				result.push(arr[i]);
			}
		}

		return result;
	}

	function shimlibForEach(arr, fn, thisArg) {
		if (!fn || !arr || typeof arr.length !== 'number') { return; }
		var thisObj = thisArg || arr;
		var len = arr.length;

		for (var i = 0; i < len; i++) {
			if (!Object.prototype.hasOwnProperty.call(arr, i)) { continue; }
			fn.call(thisObj, arr[i], i, arr);
		}
	}

	function shimlibMap(arr, fn, thisArg) {
		if (!fn || !arr || typeof arr.length !== 'number') { return; }

		var thisObj = thisArg || arr;
		var len = arr.length;
		var result = new Array(len);

		for (var i = 0; i < len; i++) {
			if (!Object.prototype.hasOwnProperty.call(arr, i)) { continue; }
			result[i] = fn.call(thisObj, arr[i], i, arr);
		}

		return result;
	}

	function shimlibSome(arr, fn, thisArg) {
		if (!fn || !arr) { return; }
		var thisObj = thisArg || arr;
		var len = arr.length;

		for (var i = 0; i < len; i++) {
			if (!Object.prototype.hasOwnProperty.call(arr, i)) { continue; }
			var currentResult = fn.call(thisObj, arr[i], i, arr);

			if (Boolean(currentResult)) {
				return true;
			}
		}

		return false;
	}

	function shimlibEvery(arr, fn, thisArg) {
		if (!fn || !arr) { return; }
		var thisObj = thisArg || arr;
		var len = arr.length;

		for (var i = 0; i < len; i++) {
			if (!Object.prototype.hasOwnProperty.call(arr, i)) { continue; }
			var currentResult = fn.call(thisObj, arr[i], i, arr);

			if (Boolean(currentResult) === false) {
				return false;
			}
		}

		return true;
	}

	function shimlibInvoke(arr, methodName, args) {
		if(!shimlibIs.isString(methodName)) {
			throw new TypeError('methodName should be a string');
		}
		if (args === _undefined) {
			args = [];
		}
		if (!shimlibIs.isArray(args)) {
			args = [args];
		}

		return shimlibMap(arr, function(val){
			var fn = val[methodName];
			if(fn === _undefined) { return; }

			return fn.apply(val, args);
		});
	}

	function shimlibPickRandom(list) {
		if (!shimlibIs.isArray(list)) { return; }
		
		var index = Math.floor(Math.random() * list.length);

		return list[index];
	}

	function shimlibPluck(arr, key) {
		var returnArr = [];

		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];

			if (!item || item[key] === _undefined) { continue; }
			returnArr.push(item[key]);
		}

		return returnArr;
	}

	var shimlibArray = {
		every: shimlibEvery,
		filter: shimlibFilter,
		forEach: shimlibForEach,
		invoke: shimlibInvoke,
		map: shimlibMap,
		pickRandom: shimlibPickRandom,
		pluck: shimlibPluck,
		some: shimlibSome
	};

	module.exports = shimlibArray;
})();