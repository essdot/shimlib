(function shimlibStringModule() {
	"use strict";
	
	var _replace = String.prototype.replace;

	var shimlibIs = require('./shimlib-is');
	
	function shimlibStrip(s) {
		if(!shimlibIs.isString(s)) { return; }

		var startPattern = /^\s+/;
		var endPattern = /\s+$/;
		var returnString = _replace.call(s, startPattern, '');
		returnString = _replace.call(returnString, endPattern, '');

		return returnString;
	}

	function shimlibInsert(s, insertS, index) {
		if (!shimlibIs.isString(s)) {
			throw new TypeError('s must be a string');
		}

		if (index < 0 || index > s.length) {
			throw new RangeError('index is out of bounds');
		}

		var start = s.substring(0, index);
		var end = s.substring(index, s.length);

		return start + insertS + end;
	}

	var shimlibString = {
		strip: shimlibStrip,
		insert: shimlibInsert,
		trim: shimlibStrip
	};

	module.exports = shimlibString;
})();