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

	function shimlibExtend(dest, source) {
		var keys = shimlibKeys(source);

		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			dest[key] = source[key];
		}

		return source;
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

	function shimlibCopyProperty(obj, sourceName, destName) {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sourceName);

		Object.defineProperty(obj, destName, descriptor);
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