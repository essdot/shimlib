(function shimlibObjectModule() {
	"use strict";
	
	var _hasOwn = Object.prototype.hasOwnProperty;
	var _undefined = void 0;

	function shimlibCreate(o) {
		if (o === _undefined ||
			o === null ||
			typeof o !== 'object') {
			return {};
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
		extend: shimlibExtend,
		keys: shimlibKeys
	};

	module.exports = shimlibObject;
})();