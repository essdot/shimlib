(function shimlibObjectModule() {
	"use strict";
	
	var _hasOwn = Object.prototype.hasOwnProperty;
	var _undefined = void 0;

	var dangerousKeys = [
		'constructor', 'toString', 'prototype', 'indexOf', 'length', 'hasOwnProperty',
		'toLocaleString', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'apply',
		'call'
	];

	function shimlibCreate(o) {
		if (typeof o !== 'object' && o !== null) {
			throw new TypeError('o must be an object, or null');
		}

		function Ctor(){}
		Ctor.prototype = o;
		return new Ctor();
	}

	function shimlibExtend(dest) {
		var sources = [].slice.call(arguments, 1);
		if (dest === undefined || sources[0] === undefined) { return; }

		for (var sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
			var source = sources[sourceIndex];
			var keys = shimlibKeys(source);

			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				dest[key] = source[key];
			}
		}

		return dest;
	}

	function shimlibExtendWithoutKeys(dest, badKeys) {
		var sources = [].slice.call(arguments, 2);
		if (dest === _undefined || sources[0] === _undefined) { return; }
		if (badKeys === _undefined || badKeys[0] === _undefined) {
			badKeys = [];
		}

		for (var sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
			var source = sources[sourceIndex];
			var keys = shimlibKeys(source);

			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];

				if (badKeys.indexOf(key) !== -1) { continue; }

				dest[key] = source[key];
			}
		}

		return dest;
	}

	function shimlibWithout(o, keys) {
		if(o === _undefined || !Array.isArray(keys)) { return; }
		var newObj = shimlibExtend({}, o);

		Array.prototype.forEach.call(keys, function(k) {
			delete newObj[k];
		});

		return newObj;
	}

	function shimlibKeys(o) {
		if (!o) { return; }

		var keys = [];

		for (var k in o) {
			if (_hasOwn.call(o, k)) {
				keys.push(k);
			}
		}

		return keys;
	}

	function shimlibCopyProperty(sourceObj, sourceName, destObj, destName) {
		var descriptor = Object.getOwnPropertyDescriptor(sourceObj, sourceName);

		Object.defineProperty(destObj, destName, descriptor);
	}

	var shimlibObject = {
		copyProp: shimlibCopyProperty,
		copyProperty: shimlibCopyProperty,
		create: shimlibCreate,
		dangerousKeys: dangerousKeys,
		extend: shimlibExtend,
		extendWithoutKeys: shimlibExtendWithoutKeys,
		keys: shimlibKeys,
		without: shimlibWithout
	};

	module.exports = shimlibObject;
})();