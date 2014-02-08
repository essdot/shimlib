(function shimlibFunctionModule() {
	"use strict";
	
	function shimlibBind(fn, context) {
		var extraArgs = [].slice.call(arguments, 2);

		return function() {
			var args = extraArgs.concat([].slice.call(arguments));

			return fn.apply(context, args);
		};
	}

	function shimlibCompose() {
		if (arguments.length < 1) { return; }
		var funcList = [].slice.call(arguments);

		return function() {
			var returnVal = funcList[0].apply(null, [].slice.call(arguments));

			for(var i = 1; i < funcList.length; i++) {
				returnVal = funcList[i].call(null, returnVal);
			}

			return returnVal;
		};
	}

	var shimlibFunction = {
		bind: shimlibBind,
		compose: shimlibCompose
	};

	module.exports = shimlibFunction;
})();