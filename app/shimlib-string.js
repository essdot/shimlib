(function shimlibStringModule() {
	"use strict";
	
	var _replace = String.prototype.replace;

	var shimlibIs = require('shimlib-is');
	
	function shimlibStrip(s) {
		if(!shimlibIs.isString(s)) { return; }

		var startPattern = /^\s+/;
		var endPattern = /\s+$/;
		var returnString = _replace.call(s, startPattern, '');
		returnString = _replace.call(returnString, endPattern, '');

		return returnString;
	}

	var shimlibString = {
		strip: shimlibStrip,
		trim: shimlibStrip
	};

	module.exports = shimlibString;
})();