(function shimlibInit(){
	"use strict";

	var shimlibArray = require('./shimlib-array');
	var shimlibIs = require('./shimlib-is');
	var shimlibKlass = require('./shimlib-klass');
	var shimlibObject = require('./shimlib-object');
	var shimlibFunction = require('./shimlib-function');
	var shimlibNumber = require('./shimlib-number');
	var shimlibQs = require('./shimlib-qs');
	var shimlibString = require('./shimlib-string');
	var shimlibTimes = require('./shimlib-times');

	var shimlibObj = {
		bind: shimlibFunction.bind,
		compose: shimlibFunction.compose,
		create: shimlibObject.create,
		extend: shimlibObject.extend,
		filter: shimlibArray.filter,
		forEach: shimlibArray.forEach,
		fromQueryString: shimlibQs.fromQueryString,
		invoke: shimlibArray.invoke,
		isArray: shimlibIs.isArray,
		isFunction: shimlibIs.isFunction,
		isNumber: shimlibIs.isNumber,
		isString: shimlibIs.isString,
		keys: shimlibObject.keys,
		klass: shimlibKlass.klass,
		map: shimlibArray.map,
		pickRandom: shimlibArray.pickRandom,
		pluck: shimlibArray.pluck,
		strip: shimlibString.strip,
		times: shimlibTimes.times,
		toFixed: shimlibNumber.toFixed,
		toQueryString: shimlibQs.toQueryString,
		trim: shimlibString.strip
	};

	module.exports = shimlibObj;
})();