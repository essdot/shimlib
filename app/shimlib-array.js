(function shimlibArrayModule() {
	"use strict";

	var _slice = [].slice.call.bind([].slice);
	var _undefined = void 0;

	var shimlibIs = require('shimlib-is');

	function shimlibFilter(fn, arr) {
		if (!fn) { return; }

		arr = arr || [];
		var result = [];

		for (var i = 0; i < arr.length; i++) {
			if (fn(arr[i]) === true) {
				result.push(arr[i]);
			}
		}

		return result;
	}

	function shimlibForEach(fn, arr) {
		if (!fn){ return; }

		var thisObj = arr;

		for (var i = 0; i < arr.length; i++) {
			var current = arr[i];

			fn.call(arr, current);
		}
	}

	function shimlibMap(fn, arr) {
		if (!fn || !arr) { return; }

		var result = [];
		for (var i = 0; i < arr.length; i++) {
			
			var args = _slice(arguments, 2);
			args.unshift(arr[i]);

			result[i] = fn.apply(arr, args);
		}

		return result;
	}

	function shimlibInvoke(fn, list, args) {
		if (!args) {
			args = [];
		}
		if (!shimlibIs.isArray(args)){
			args = [args];
		}

		return shimlibMap(function(val){
			if (shimlibIs.isString(fn)) {
				if (!val[fn]) {
					return;
				}

				fn = val[fn];
			}

			return fn.apply(val, args);
		}, list);
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
		filter: shimlibFilter,
		forEach: shimlibForEach,
		invoke: shimlibInvoke,
		map: shimlibMap,
		pickRandom: shimlibPickRandom,
		pluck: shimlibPluck
	};

	module.exports = shimlibArray;
})();