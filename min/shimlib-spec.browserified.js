(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function shimlibArrayModule() {
	"use strict";

	var _undefined = void 0;

	var shimlibIs = require('./shimlib-is');

	function shimlibFilter(fn, arr, thisArg) {
		if (!fn) { return; }
		arr = arr || [];
		var result = [];
		var thisObj = thisArg || arr;

		for (var i = 0; i < arr.length; i++) {
			if (fn.call(thisObj, arr[i], i, arr) === true) {
				result.push(arr[i]);
			}
		}

		return result;
	}

	function shimlibForEach(fn, arr, thisArg) {
		if (!fn){ return; }
		var thisObj = thisArg || arr;

		for (var i = 0; i < arr.length; i++) {
			var current = arr[i];

			fn.call(thisObj, current, i, arr);
		}
	}

	function shimlibMap(fn, arr, thisArg) {
		if (!fn || !arr) { return; }
		var result = [];
		var thisObj = thisArg || arr;


		for (var i = 0, j = 0; i < arr.length; i++) {
			if (arr[i] === undefined) { continue; }

			result[j] = fn.call(thisObj, arr[i], i, arr);
			j++;
		}

		return result;
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

		return shimlibMap(function(val){
			var fn = val[methodName];
			if(fn === _undefined) { return; }

			return fn.apply(val, args);
		}, arr);
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
},{"./shimlib-is":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
(function shimlibIsModule() {
	"use strict";

	function shimlibIsString(o) {
		return typeof o === "string" || o instanceof String;
	}

	function shimlibIsFunction(f) {
		return typeof f === "function";
	}

	function shimlibIsArray(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    }

    function shimlibIsNumber(o) {
		return Object.prototype.toString.call(o) === "[object Number]";
    }

    var shimlibIs = {
		isArray: shimlibIsArray,
		isFunction: shimlibIsFunction,
		isNumber: shimlibIsNumber,
		isString: shimlibIsString
    };

    module.exports = shimlibIs;
})();
},{}],4:[function(require,module,exports){
(function shimlibKlassModule() {
	"use strict";
	
	var _slice = [].slice.call.bind([].slice);
	var _undefined = void 0;

	var shimlibObject = require('./shimlib-object');
	var shimlibArray = require('./shimlib-array');

	function objectIsGlobal(o) {
		function getGlobal() { return this; }

		return o === getGlobal();
	}

	// Returns a *factory function* (klass) that makes an object. Not a constructor!!!
	// The factory function calls the constructor with "new" itself.

	// Watch out: the actual constructor function is Klass (capitalized), 
	// the factory function is klass (lowercase)!
	function shimlibKlass(methodsAndProps) {
		// Constructor - capitalized
		function Klass() {}

		// Factory function - lowercase
		// This is what gets returned to shimlibKlass callers
		function klass(o){
			var newObj;

			// Try to determine if we have been called as a constructor
			if (this !== _undefined && !objectIsGlobal(this)) {
				newObj = this;
			} else {
				newObj = new Klass();
			}

			// Copy properties from argument for this instance only
			shimlibObject.extend(newObj, o);

			if (typeof newObj.initialize === 'function') {
				newObj.initialize(o);
			}

			return newObj;
		}

		Klass.prototype = Object.create(methodsAndProps);
		// In case klass is accidentally called with a constructor
		klass.prototype = Klass.prototype;

		klass.addMethod = function klassMethod(name, fn) {
			methodsAndProps[name] = fn;
		};

		klass.method = klass.addMethod;

		// Private methods get the _private object injected as a parameter
		klass.privateMethod = function klassPrivateMethod(name, fn) {
			methodsAndProps[name] = function() {
				var args = _slice(arguments);
				args.unshift(_private);
				return fn.apply(this, args);
			};
		};

		var _private = {};
		var _static = {};

		klass.extend = function klassExtend(o) {
			var newMethodsAndProps = Object.create(methodsAndProps);
			shimlibObject.extend(newMethodsAndProps, o || {});

			var newKlass = shimlibKlass(newMethodsAndProps);
			newKlass.private(_private);
			newKlass.static(_static);
			newKlass.$super = klass;

			return newKlass;
		};

		klass.private = function klassPrivate(privObj) {
			shimlibObject.extend(_private, privObj);
		};

		klass.static = function klassStatic(staticObj) {
			var badKeys = [ 'addMethod', 'extend', 'method', 'privateMethod', 'private', 'static' ];
			badKeys = badKeys.concat(shimlibObject.dangerousKeys);

			shimlibObject.extendWithoutKeys(klass, badKeys, staticObj);
			shimlibObject.extendWithoutKeys(_static, badKeys, staticObj);
		};

		return klass;
	}

	module.exports = {
		klass: shimlibKlass
	};
})();
},{"./shimlib-array":1,"./shimlib-object":6}],5:[function(require,module,exports){
(function shimlibNumberModule() {
	"use strict";

	var shimlibIs = require('./shimlib-is');
	var shimlibTimes = require('./shimlib-times');

	function shimlibToFixed(n, precision) {
		if (!shimlibIs.isNumber(n)) { return; }
		if (!shimlibIs.isNumber(precision)) {
			precision = 2;
		}

		if (precision === 0) {
			return Number.prototype.toString.call(Math.floor(n));
		}

		if (n === 0) {
			return '0.' + shimlibTimes.timesString('0', precision);
		}

		var nBig = n * Math.pow(10, precision);

		if (n < 0) {
			nBig = Math.ceil(nBig);
		} else {
			nBig = Math.floor(nBig);
		}

		var nBigString = Number.prototype.toString.call(nBig);
		var stringStart = nBigString.substring(0, nBigString.length - precision);
		var stringEnd = nBigString.substring(nBigString.length - precision);

		if (stringStart === '-' || stringStart === '') {
			stringStart += '0';
		}

		return stringStart + '.' + stringEnd;
	}

	var shimlibNumber = {
		toFixed: shimlibToFixed
	};

	module.exports = shimlibNumber;
})();
},{"./shimlib-is":3,"./shimlib-times":9}],6:[function(require,module,exports){
(function shimlibObjectModule() {
	"use strict";
	
	var _hasOwn = Object.prototype.hasOwnProperty;
	var _undefined = void 0;

	var dangerousKeys = [ 'constructor', 'toString', 'prototype', 'indexOf', 'length', 'hasOwnProperty', 'toLocaleString', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable' ];

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
},{}],7:[function(require,module,exports){
(function shimlibQsModule() {
	"use strict";

	var _hasOwn = Object.prototype.hasOwnProperty;
	var _undefined = void 0;

	var shimlibIs = require('./shimlib-is');
	var shimlibObject = require('./shimlib-object');

	function shimlibToQueryString(o) {
		if (!o) { return; }

		function stringFromPair(key, val) {
			var returnVal = encodeURIComponent(key);

			if (val !== '' && val !== _undefined && val !== null) {
				returnVal += "=" + encodeURIComponent(val);
			}

			return returnVal;
		}

		function stringForKey(key) {
			var val = o[key];

			if (shimlibIs.isArray(val)) {
				return val.map(function(valval) {
					return stringFromPair(key, valval);
				}).join('&');
			} else {
				return stringFromPair(key, val);
			}
		}

		var keys = shimlibObject.keys(o);

		return keys.map(stringForKey).join('&');
	}

	function shimlibFromQueryString(qs) {
		// segment is 'value=key'
		function pairFromSegment(segment) {
			var arr = segment.split('=');
			var pair = {
				key: decodeURIComponent(arr.shift()),
				val: arr.length > 1 ? arr.join('=') : arr[0]
			};

			pair.val = normalizeValue(pair.val);

			return pair;
		}

		function normalizeValue(val) {
			if (val === _undefined) { return ''; }

			val = decodeURIComponent(val);
			
			var valAsNumber = val - 0;

			if (!isNaN(valAsNumber) && val !== '') {
				val = valAsNumber;
			}

			return val;
		}

		function addPairToObject(pair, obj) {
			if (_hasOwn.call(obj, pair.key)) {
				if (!shimlibIs.isArray(obj[pair.key])) {
					obj[pair.key] = [ obj[pair.key] ];
				}

				obj[pair.key].push(pair.val);
			} else {
				obj[pair.key] = pair.val;
			}
		}

		if (!qs) { return; }
		var match = qs.match(/([^?#]*)(#.*)?$/);
		if (!match) return { };

		var segments = match[1].split('&');

		var newObj = {};

		for (var i = 0; i < segments.length; i++) {
			var pair = pairFromSegment(segments[i]);

			addPairToObject(pair, newObj);
		}

		return newObj;
	}

	var shimlibQs = {
		toQueryString: shimlibToQueryString,
		fromQueryString: shimlibFromQueryString
    };

    module.exports = shimlibQs;
})();
},{"./shimlib-is":3,"./shimlib-object":6}],8:[function(require,module,exports){
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

	var shimlibString = {
		strip: shimlibStrip,
		trim: shimlibStrip
	};

	module.exports = shimlibString;
})();
},{"./shimlib-is":3}],9:[function(require,module,exports){
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

	var shimlibTimes = {
		times: shimlibTimes,
		timesString: shimlibTimesString,
		timesValue: shimlibTimesValue
	};
	module.exports = shimlibTimes;
})();
},{"./shimlib-is":3}],10:[function(require,module,exports){
describe('shimlib array', function() {
	shimlibArray = require('../../app/shimlib-array');

	it('filter', function(){
		var evenFunc = function(n) {
			return n % 2 === 0;
		};

		var falseFunc = function() {
			return false;
		};

		expect(shimlibArray.filter(evenFunc, [1, 2, 3, 4, 5, 6])).to.deep.equal([2, 4, 6]);
		expect(shimlibArray.filter(falseFunc, [1, 2, 3, 4, 5, 6])).to.deep.equal([]);
	});

	it('filter passes arguments to callback', function() {
		var funcResults = [];
		var func = function(item, index, arr) {
			var isEven = item % 2 === 0;
			funcResults.push({
				item: item,
				index: index,
				arr: arr,
				isEven: isEven
			});

			return isEven;
		};

		var arr = [ 4, 5, 6 ];

		var filterResult = shimlibArray.filter(func, arr);

		expect(filterResult).to.deep.equal([ 4, 6 ]);
		expect(funcResults).to.deep.equal([
			{
				item: 4,
				isEven: true,
				index: 0,
				arr: [ 4, 5, 6 ]
			},

			{
				item: 5,
				isEven: false,
				index: 1,
				arr: [ 4, 5, 6 ]
			},

			{
				item: 6,
				isEven: true,
				index: 2,
				arr: [ 4, 5, 6 ]
			}
		]);
	});

	it('filter with thisArg', function() {
		var obj = {
			str: 'my ',
			arr: []
		};

		var func = function(s) {
			this.arr.push(this.str + s);
			return true;
		};

		var arr = [ 'whip', 'lambo', 'hoopty' ];

		shimlibArray.filter(func, arr, obj);

		expect(obj.arr).to.deep.equal([ 'my whip', 'my lambo', 'my hoopty' ]);
	});

	it('filter iterate on object', function() {
		var iterateObject = {
			prop1: 'abc',
			prop2: 'def',
			'0': 'first value',
			'1': 'second value',
			'2': 'third value'
		};

		var s = '';

		var func = function(val) {
			s = s + val + ', ';

			return val.indexOf('i') !== -1;
		};

		var filterResult = shimlibArray.filter(func, iterateObject);
		expect(filterResult).to.deep.equal([]);
		expect(s).to.equal('');

		iterateObject.length = 3;
		filterResult = shimlibArray.filter(func, iterateObject);
		expect(filterResult).to.deep.equal([ 'first value', 'third value' ]);
		expect(s).to.equal('first value, second value, third value, ');
	});

	it('foreach', function(){
		var arr = [1, 2, 3, 4];

		var s = "";
		var func = function(val){
			s = s + (val * 2).toString();
		};

		shimlibArray.forEach(func, arr);
		expect(s).to.equal("2468");
	});

	it('foreach passes arguments to callback', function(){
		var funcResults = [];
		var func = function(item, index, arr) {
			funcResults.push({
				item: item,
				index: index,
				arr: arr
			});
		};

		var arr = [ 'Ghostface', 'Method Man', 'Raekwon' ];

		shimlibArray.forEach(func, arr);

		expect(funcResults).to.deep.equal([
			{
				item: 'Ghostface',
				index: 0,
				arr: [ 'Ghostface', 'Method Man', 'Raekwon' ]
			},

			{
				item: 'Method Man',
				index: 1,
				arr: [ 'Ghostface', 'Method Man', 'Raekwon' ]
			},

			{
				item: 'Raekwon',
				index: 2,
				arr: [ 'Ghostface', 'Method Man', 'Raekwon' ]
			}
		]);
	});

	it('foreach with thisArg', function(){
		var obj = {
			str: 'get that ',
			arr: []
		};

		var func = function(s) {
			this.arr.push(this.str + s);
		};

		var arr = [ 'fetty', 'cheddar', 'guap' ];

		shimlibArray.forEach(func, arr, obj);

		expect(obj.arr).to.deep.equal([ 'get that fetty', 'get that cheddar', 'get that guap' ]);
	});

	it('foreach iterate on object', function() {
		var iterateObject = {
			prop1: 'abc',
			prop2: 'def',
			'0': 'first value',
			'1': 'second value',
			'2': 'third value'
		};

		var s = '';

		var func = function(val) {
			if (val === undefined) { return; }
			s = s + val + ', ';
		};

		shimlibArray.forEach(func, iterateObject);
		expect(s).to.equal('');

		iterateObject.length = 3;

		shimlibArray.forEach(func, iterateObject);
		expect(s).to.equal('first value, second value, third value, ');
	});

	it('invoke', function() {
		var func = function(n) {
			return this.number + n;
		};

		var obj1  = { addFunc: func, number: 5 };
		var obj2  = { addFunc: func, number: 13 };
		var obj3  = { addFunc: func, number: 82 };
		var arr  = [ obj1, obj2, obj3 ];

		var invokeResult = shimlibArray.invoke(arr, 'addFunc', 17);
		expect(invokeResult).to.deep.equal([ 22, 30, 99 ]);
	});

	it('map', function(){
		var doubleFunc = function(n) {
			return n * 2;
		};

		var toString = function(n) {
			return n.toString();
		};

		expect(shimlibArray.map(doubleFunc, [1, 2, 3])).to.deep.equal([2, 4, 6]);

		expect(shimlibArray.map(toString, [6, 7, 8])).to.deep.equal(['6', '7', '8']);
	});

	it('map with thisArg', function(){
		var func = function(n) {
			return this.str + n.toString();
		};

		var obj = {
			str: 'abc'
		};

		var arr = [1, 2, 3];

		expect(shimlibArray.map(func, arr, obj)).to.deep.equal(['abc1', 'abc2', 'abc3' ]);
	});

	it('map passes arguments to function', function(){
		var func = function(item, index, arr) {
			return {
				item: item,
				index: index,
				arr: arr
			};
		};

		var arr = [ 'hello', 'goodbye', 'arrivederci' ];

		expect(shimlibArray.map(func, arr)).to.deep.equal([
			{
				item: 'hello',
				index: 0,
				arr: [ 'hello', 'goodbye', 'arrivederci' ]
			},

			{
				item: 'goodbye',
				index: 1,
				arr: [ 'hello', 'goodbye', 'arrivederci' ]
			},

			{
				item: 'arrivederci',
				index: 2,
				arr: [ 'hello', 'goodbye', 'arrivederci' ]
			}
		]);
	});

	it('map iterate on object', function() {
		var iterateObject = {
			prop1: 'abc',
			prop2: 'def',
			'0': 'first value',
			'1': 'second value',
			'2': 'third value'
		};

		var func = function(s) {
			return s;
		};

		var mapResult = shimlibArray.map(func, iterateObject);
		expect(mapResult).to.deep.equal([]);

		iterateObject.length = 3;
		mapResult = shimlibArray.map(func, iterateObject);
		expect(mapResult).to.deep.equal([ 'first value', 'second value', 'third value' ]);
	});

	it('map skips undefined elements', function() {
		var arr = [ 1, 2, undefined, 3, undefined, 5 ];
		var arr2 = [ undefined, undefined, undefined ];
		var arr3 = [ undefined, /re/, undefined ];

		var fn = function(o) { return o.toString(); };

		expect(shimlibArray.map(fn, arr)).to.deep.equal([ '1', '2', '3', '5' ]);
		expect(shimlibArray.map(fn, arr2)).to.deep.equal([ ]);
		expect(shimlibArray.map(fn, arr3)).to.deep.equal([ '/re/' ]);
	});

	it('pick random', function(){
		var list = [1, 2, 3, 4, 5, 6, 7, 8];
		var randomPick = shimlibArray.pickRandom(list);
		var index = list.indexOf(randomPick);

		expect(index).to.be.within(0, list.length - 1);
		expect(list[index]).to.equal(randomPick);
	});

	it('pluck', function() {
		var arr = [
			{ name: 'John', age: 34 },
			{ name: 'Jack', age: 31 },
			{ name: 'Jane', age: 20 },
			{ name: 'Jan', age: 22 }
		];

		var arr2 = [
			{ name: 'Jern', age: 44 },
			{ name: 'Jold', age: 54 },
			undefined,
			{ name: 'Jilm', age: 29 }
		];

		expect(shimlibArray.pluck(arr, 'name')).to.deep.equal([ 'John', 'Jack', 'Jane', 'Jan' ]);
		expect(shimlibArray.pluck(arr, 'age')).to.deep.equal([ 34, 31, 20, 22 ]);

		expect(shimlibArray.pluck(arr2, 'name')).to.deep.equal([ 'Jern', 'Jold', 'Jilm' ]);
		expect(shimlibArray.pluck(arr2, 'age')).to.deep.equal([ 44, 54, 29 ]);
		expect(shimlibArray.pluck(arr2, 'yitta')).to.deep.equal([]);
	});
});
describe('shimlib function', function() {
	var shimlibFunction = require('../../app/shimlib-function');
	
	it('bind', function(){
		var obj = { hoobar: 8 };
		var func = function(n) {
			return this.hoobar + n;
		};

		var boundFunc = shimlibFunction.bind(func, obj);

		expect(boundFunc(1)).to.equal(9);
		obj.hoobar = 12;
		expect(boundFunc(1)).to.equal(13);
	});

	it('bind partial apply', function(){
		var func = function(arg1, arg2) {
			return arg1 + arg2 + this.num;
		};

		var obj = {
			num: 7
		};

		var boundFunc = shimlibFunction.bind(func, obj, 19);
		expect(boundFunc(4)).to.equal(30);

		boundFunc = shimlibFunction.bind(func, obj, 0);
		expect(boundFunc(8)).to.equal(15);
	});

	it('compose', function() {
		var func1 = function(arg){
			return arg * 5;
		};

		var func2 = function(arg) {
			return arg - 3;
		};

		var func3 = function() {
			return 6;
		};

		var composed = shimlibFunction.compose(func1, func2);
		expect(composed(5)).to.equal(22);
		expect(composed(1)).to.equal(2);

		var composed2 = shimlibFunction.compose(func1, func2, func1);
		expect(composed2(1)).to.equal(10);
		expect(composed2(2)).to.equal(35);

		var composed3 = shimlibFunction.compose(func3, func2, func1);
		expect(composed3()).to.equal(15);
	});
});
describe('shimlib is', function() {
	shimlibIs = require('../../app/shimlib-is');

	it('is array', function(){
		var isa = shimlibIs.isArray;

		expect(isa([1, 2, 3])).to.equal(true);
		expect(isa([])).to.equal(true);
		expect(isa(new Array())).to.equal(true);
		
		expect(isa({})).to.equal(false);
		expect(isa(null)).to.equal(false);
		expect(isa(undefined)).to.equal(false);
		expect(isa('s')).to.equal(false);
		expect(isa(function(){})).to.equal(false);
	});

	it('is function', function() {
		var isf = shimlibIs.isFunction;

		expect(isf(Array)).to.equal(true);
		expect(isf(Math.abs)).to.equal(true);
		expect(isf(isNaN)).to.equal(true);
		expect(isf(new Function(''))).to.equal(true);
		expect(isf(Object.prototype.toString)).to.equal(true);

		expect(isf(null)).to.equal(false);
		expect(isf({})).to.equal(false);
		expect(isf([])).to.equal(false);
		expect(isf(Object.prototype)).to.equal(false);
		expect(isf('s')).to.equal(false);
	});

	it('is string', function(){
		var iss = shimlibIs.isString;

		expect(iss('s')).to.equal(true);
		expect(iss(new String('s'))).to.equal(true);
		expect(iss(5 + '')).to.equal(true);

		expect(iss(5)).to.equal(false);
		expect(iss([1, 2, 3])).to.equal(false);
		expect(iss({})).to.equal(false);
		expect(iss(undefined)).to.equal(false);
		expect(iss(null)).to.equal(false);
	});
});
describe('shimlib klass', function() {
	shimlibKlass = require('../../app/shimlib-klass');
	
	it('klass', function(){
		var Animal = shimlibKlass.klass({
			animalKind: undefined,
			callSound: undefined,

			doCall: function() {
				return this.callSound + "!!!";
			},

			getKind: function() {
				return this.animalKind;
			}
		});

		var Auto = shimlibKlass.klass({
				autoKind: undefined,
				hornSound: undefined,
				tootHorn: function () {
					return this.hornSound + '!!!';
				},
			},
			{
				privateVal: 'shhh'
			}
		);

		var tiger = Animal({ animalKind: 'tiger', callSound: 'roar' });
		var elephant = Animal({ animalKind: 'elephant', callSound: 'braaamp' });

		expect(tiger.doCall()).to.equal('roar!!!');
		expect(tiger.getKind()).to.equal('tiger');
		expect(tiger.animalKind).to.equal('tiger');

		expect(elephant.doCall()).to.equal('braaamp!!!');
		expect(elephant.getKind()).to.equal('elephant');
		expect(elephant.animalKind).to.equal('elephant');

		var car = Auto({ autoKind: 'car', hornSound: 'honk' });
		var truck = Auto({ autoKind: 'truck', hornSound: 'braaamp' });

		expect(car.tootHorn()).to.equal('honk!!!');
		expect(car.autoKind).to.equal('car');

		expect(truck.tootHorn()).to.equal('braaamp!!!');
		expect(truck.autoKind).to.equal('truck');

		expect(car.brake).to.equal(undefined);

		Auto.addMethod('brake', function brake(){ return 'stop!'; });

		expect(car.brake).to.be.a('function');
		expect(car.brake).to.equal(truck.brake);
		expect(car.brake()).to.equal('stop!');
	});

	it('klass private members', function() {

		var Auto = shimlibKlass.klass({
				autoKind: undefined,
				hornSound: undefined,
				tootHorn: function () {
					return this.hornSound + '!!!';
				},
			}
		);

		Auto.private({ secret: 'shhh' });

		var car = Auto({ autoKind: 'car', hornSound: 'honk' });
		var truck = Auto({ autoKind: 'truck', hornSound: 'braaamp' });

		expect(car.getSecret).to.equal(undefined);
		expect(truck.getSecret).to.equal(undefined);

		Auto.privateMethod('getSecret', function(_private){
			return _private.secret;
		});

		expect(Auto.secret).to.equal(undefined);
		expect(car.secret).to.equal(undefined);
		expect(truck.secret).to.equal(undefined);
		expect(Auto._private).to.equal(undefined);
		expect(car._private).to.equal(undefined);
		expect(truck._private).to.equal(undefined);
		expect(car.getSecret()).to.equal('shhh');
		expect(truck.getSecret()).to.equal('shhh');
	});

	it('calls initialize', function() {
		var count = 0;

		var Machine = shimlibKlass.klass({
			machineKind: undefined,
			powerSource: undefined,

			getSource: function() {
				return powerSource;
			},

			initialize: function() {
				this.count = count++;
			}
		});

		var lathe = Machine({ machineKind: 'lathe' });
		var bandSaw = Machine({ machineKind: 'band saw' });

		expect(lathe.count).to.equal(0);
		expect(bandSaw.count).to.equal(1);
	});

	it('extend', function(){
		var Machine = shimlibKlass.klass({
			machineKind: undefined,
			isMachine: true,
			ping: function() {
				return 'ping!';
			}
		});

		Machine.static({ likesPower: true });

		var NuclearMachine = Machine.extend({
			machineKind: 'nuclear',
			isNuclear: true,
			modelNumber: undefined,
			meltdown: function() {
				return 'OH NOOOOOO';
			}
		});

		var nukeMachine = NuclearMachine({ modelNumber: '1234' });

		expect(NuclearMachine.$super).to.equal(Machine);
		expect(Machine.likesPower).to.equal(true);
		expect(NuclearMachine.likesPower).to.equal(true);

		expect(nukeMachine.isMachine).to.equal(true);
		expect(nukeMachine.modelNumber).to.equal('1234');
		expect(nukeMachine.meltdown).to.be.a('function');
		expect(nukeMachine.machineKind).to.equal('nuclear');
		expect(nukeMachine.ping()).to.equal('ping!');

		var plainMachine = Machine({ machineKind: 'plain' });

		expect(plainMachine.machineKind).to.equal('plain');
		expect(plainMachine.isMachine).to.equal(true);
		expect(plainMachine.modelNumber).to.equal(undefined);
		expect(plainMachine.meltdown).to.equal(undefined);

		Machine.addMethod('powerOn', function() {
			return 'bwoop';
		});

		expect(plainMachine.powerOn()).to.equal('bwoop');
		expect(nukeMachine.powerOn()).to.equal('bwoop');
	});

	it('static', function() {
		var Fruit = shimlibKlass.klass({
			hasCore: undefined,
			isSweet: true,
			initialize: function() {
				Fruit.addFruitInstance(this);
			}
		});

		Fruit.static({
			allFruits: [],

			addFruitInstance: function(instance) {
				Fruit.allFruits.push(instance);
			}
		});

		var apple = Fruit({ hasCore: true });
		var raspberry = Fruit({ hasCore: false });
		var peach = Fruit({ hasCore: true });

		expect(Fruit.addFruitInstance).to.be.a('function');
		expect(Fruit.allFruits).to.deep.equal([ apple, raspberry, peach ]);
	});

	it('works when accidentally called with new', function() {
		var s = '';

		var Wine = shimlibKlass.klass({
			initialize: function() {
				s += this.varietal;
			},
			varietal: undefined,
			swirl: function() {
				return "swish swish!";
			}
		});

		var cab = Wine({ varietal: "Cabernet Sauvignon" });
		expect(cab.varietal).to.equal('Cabernet Sauvignon');
		expect(cab.swirl()).to.equal('swish swish!');

		var oopsShiraz = new Wine({ varietal: 'Shiraz' });
		expect(oopsShiraz.varietal).to.equal('Shiraz');
		expect(oopsShiraz.swirl()).to.equal('swish swish!');

		expect(s).to.equal('Cabernet SauvignonShiraz');
	});
});

describe('shimlib number', function() {
	shimlibNumber = require('../../app/shimlib-number');
	
	it('to fixed', function(){
		expect(shimlibNumber.toFixed(75, 0)).to.equal('75');
		expect(shimlibNumber.toFixed(75, 1)).to.equal('75.0');
		expect(shimlibNumber.toFixed(75, 2)).to.equal('75.00');
		expect(shimlibNumber.toFixed(-75, 2)).to.equal('-75.00');
		expect(shimlibNumber.toFixed(75.105, 2)).to.equal('75.10');
		expect(shimlibNumber.toFixed(-75.106, 2)).to.equal('-75.10');
		expect(shimlibNumber.toFixed(2.00193, 3)).to.equal('2.001');
		expect(shimlibNumber.toFixed(-1, 3)).to.equal('-1.000');
		expect(shimlibNumber.toFixed(-1.6789, 3)).to.equal('-1.678');
		expect(shimlibNumber.toFixed(1.111111111111111, 6)).to.equal('1.111111');
		expect(shimlibNumber.toFixed(0, 0)).to.equal('0');
		expect(shimlibNumber.toFixed(0, 1)).to.equal('0.0');
		expect(shimlibNumber.toFixed(0, 2)).to.equal('0.00');
		expect(shimlibNumber.toFixed(-0, 2)).to.equal('0.00');
		expect(shimlibNumber.toFixed(0, 6)).to.equal('0.000000');
		expect(shimlibNumber.toFixed(683039.112556, 4)).to.equal('683039.1125');
		expect(shimlibNumber.toFixed(-683039.112556, 4)).to.equal('-683039.1125');
		expect(shimlibNumber.toFixed(1234.1234, 4)).to.equal('1234.1234');
		expect(shimlibNumber.toFixed(6789.67899, 4)).to.equal('6789.6789');
		expect(shimlibNumber.toFixed(6789.90909090, 6)).to.equal('6789.909090');
		expect(shimlibNumber.toFixed(-6789.90909090, 6)).to.equal('-6789.909090');
		expect(shimlibNumber.toFixed(0.5, 1)).to.equal('0.5');
		expect(shimlibNumber.toFixed(-0.5, 1)).to.equal('-0.5');
		expect(shimlibNumber.toFixed(0.5, 6)).to.equal('0.500000');
		expect(shimlibNumber.toFixed(-0.5, 6)).to.equal('-0.500000');
		expect(shimlibNumber.toFixed((2/3), 6)).to.equal('0.666666');
		expect(shimlibNumber.toFixed(-(2/3), 2)).to.equal('-0.66');
		expect(shimlibNumber.toFixed((1/4), 6)).to.equal('0.250000');
		expect(shimlibNumber.toFixed((1/8), 6)).to.equal('0.125000');
	});
});
describe('shimlib object', function() {
	var shimlibObject = require('../../app/shimlib-object');
	
	it('extend', function() {
		var empty = {};
		var objA = { name: 'Jeff', job: 'Clerk', age: 31 };
		var objB = { age: 33, city: 'Boston' };

		shimlibObject.extend(objA, objB);
		expect(objA.age).to.equal(33);
		expect(objA.city).to.equal('Boston');
		expect(objA.job).to.equal('Clerk');

		shimlibObject.extend(empty, objB);
		expect(empty.city).to.equal('Boston');
		expect(empty.age).to.equal(33);
	});

	it('extend multiple sources', function() {
		var coffee = {
			espresso: 'espresso',
			cappuccino: 'cappuccino',
			caffeine: true
		};

		var juice = {
			orange: 'orange',
			grapefruit: 'grapefruit',
			caffeine: false
		};

		var drinks = {};
		shimlibObject.extend(drinks, coffee, juice);

		expect(drinks.espresso).to.equal('espresso');
		expect(drinks.orange).to.equal('orange');
		expect(drinks.caffeine).to.equal(false);
	});

	it('keys', function() {
		var obj = {
			derf: 7,
			whin: 'abc',
			varn: []
		};

		expect(shimlibObject.keys(obj)).to.deep.equal(['derf', 'whin', 'varn']);
		
		var arr = [5, 6, 7];
		expect(shimlibObject.keys(arr)).to.deep.equal(['0', '1', '2']);
		
		expect(shimlibObject.keys({})).to.deep.equal([]);
		
		//obj2's prototype is obj
		var obj2 = Object.create(obj);
		expect(obj2.derf).to.equal(7);
		expect(obj2.whin).to.equal('abc');
		expect(shimlibObject.keys(obj2)).to.deep.equal([]);
	});


	it('create', function(){
		var obj = {
			bumbo: 7,
			wulgus: 'abc',
			bibby: []
		};
		var obj2 = shimlibObject.create(obj);
		var obj3 = shimlibObject.create(obj);
		var arrayObj = shimlibObject.create([1, 2, 3]);

		expect(shimlibObject.create(undefined)).to.deep.equal({});
		expect(shimlibObject.create(null)).to.deep.equal({});
		expect(shimlibObject.create({})).to.deep.equal({});
		
		expect(obj2.bumbo).to.equal(7);
		expect(obj2.wulgus).to.equal('abc');
		expect(obj2.bibby).to.deep.equal([]);
		expect(obj2.hasOwnProperty('bumbo')).to.equal(false);
		expect(obj2.hasOwnProperty('wulgus')).to.equal(false);
		expect(obj2.hasOwnProperty('bibby')).to.equal(false);

		expect(obj2).to.deep.equal(obj3);
		expect(obj2).to.not.equal(obj3);

		expect(arrayObj[0]).to.equal(1);
		expect(arrayObj['1']).to.equal(2);
		expect(arrayObj[2]).to.equal(3);
		expect(arrayObj.length).to.equal(3);
		expect(arrayObj.hasOwnProperty('0')).to.equal(false);
		expect(arrayObj.hasOwnProperty('1')).to.equal(false);
		expect(arrayObj.hasOwnProperty('2')).to.equal(false);
		expect(arrayObj.hasOwnProperty('length')).to.equal(false);
		expect(Array.isArray(arrayObj)).to.equal(false);
	});

	it('copy property', function() {
		var obj = {
			team: 'Supersonics'
		};

		var obj2 = {
			team: 'Lakers'
		};

		Object.defineProperty(obj, 'myTeam', {
			get: function() {
				return this.team;
			}
		});

		expect(obj.myTeam).to.equal('Supersonics');

		expect(obj.hasOwnProperty('myTeam2')).to.equal(false);

		shimlibObject.copyProperty(obj, 'myTeam', obj, 'myTeam2');
		shimlibObject.copyProperty(obj, 'myTeam', obj2, 'myTeam');

		expect(obj.hasOwnProperty('myTeam2')).to.equal(true);
		expect(obj2.hasOwnProperty('myTeam')).to.equal(true);

		expect(obj.myTeam2).to.equal('Supersonics');
		expect(obj2.myTeam).to.equal('Lakers');
	});

	it('without', function() {
		var obj1 = { rain: true, snow: false, sleet: true };
		var obj2 = { snow: false };

		expect(shimlibObject.without(obj1, [ 'rain', 'sleet' ])).to.deep.equal(obj2);
	});
});
describe('shimlib query string', function(){
	shimlibQs = require('../../app/shimlib-qs');

	it('handle number values', function() {
		var qs = 'decimal=1.7903&negativeDecimal=-0.235&zero=0&integer=12&negativeInteger=-28';

		var obj = {
			decimal: 1.7903,
			negativeDecimal: -0.235,
			zero: 0,
			integer: 12,
			negativeInteger: -28
		};

		expect(shimlibQs.fromQueryString(qs)).to.deep.equal(obj);
		expect(shimlibQs.toQueryString(obj)).to.deep.equal(qs);
	});

	it('handle encoded strings', function() {
		var qs = 'crazy%3Aname=y&rappers=biggie%20%26%20pac&valWithEqSigns=a%3Db%3Dc&abc=abc';
		var obj = {
			'crazy:name': 'y',
			rappers: 'biggie & pac',
			valWithEqSigns: 'a=b=c',
			abc: 'abc'
		};

		expect(shimlibQs.fromQueryString(qs)).to.deep.equal(obj);
		expect(shimlibQs.toQueryString(obj)).to.deep.equal(qs);
	});

	it('handle array values', function() {
		var qs = 'strings=dd&strings=ff&strings=ty&numbers=1&numbers=2&numbers=3&numbers=4&empty&empty&mixed&mixed=1&mixed=hello';
		var obj = {
			strings: [ 'dd', 'ff', 'ty' ],
			numbers: [ 1, 2, 3, 4 ],
			empty: [ '', '' ],
			mixed: ['', 1, 'hello']
		};

		expect(shimlibQs.fromQueryString(qs)).to.deep.equal(obj);
		expect(shimlibQs.toQueryString(obj)).to.deep.equal(qs);
	});

	it('to query string', function() {
		var qs = 'empty&empty2&negOne=-1&zero=0&hoobar=8&glenk=77&gary=abc&brelt=dd&brelt=ff&brelt=ty&laild=1&laild=2&laild=3&laild=4&rappers=biggie%20%26%20pac&valWithEqSigns=a%3Db%3Dc&crazy%3Aname=y';
		var obj = {
			empty: '',
			empty2: '',
			negOne: -1,
			zero: 0,
			hoobar: 8,
			glenk: 77,
			gary: 'abc',
			brelt: ['dd', 'ff', 'ty'],
			laild: [1, 2, 3, 4],
			rappers: 'biggie & pac',
			valWithEqSigns: 'a=b=c',
			'crazy:name': 'y'
		};

		expect(shimlibQs.toQueryString(obj)).to.equal(qs);
	});

	it('from query string', function() {
		var qs = 'empty&empty2=&negOne=-1&zero=0&hoobar=8&glenk=77&gary=abc&brelt=dd&brelt=ff&brelt=ty&laild=1&laild=2&laild=3&laild=4&rappers=biggie%20%26%20pac&valWithEqSigns=a%3Db%3Dc&crazy%3Aname=y';
		var obj = {
			empty: '',
			empty2: '',
			negOne: -1,
			zero: 0,
			hoobar: 8,
			glenk: 77,
			gary: 'abc',
			brelt: ['dd', 'ff', 'ty'],
			laild: [1, 2, 3, 4],
			rappers: 'biggie & pac',
			valWithEqSigns: 'a=b=c',
			'crazy:name': 'y'
		};

		expect(shimlibQs.fromQueryString(qs)).to.deep.equal(obj);
	});

	it('query string from url', function() {
		var url = 'http://www.example.com?section=blog&id=45#comments';
		var urlObj = { section: 'blog', id: 45 };

		expect(shimlibQs.fromQueryString(url)).to.deep.equal(urlObj);
	});
});

describe('shimlib string', function() {
	var shimlibString = require('../../app/shimlib-string');

	it('strip', function(){
		var s = "  abc  ";
		var tab = String.fromCharCode(9);

		expect(shimlibString.strip('  123  ')).to.equal('123');
		expect(shimlibString.strip('123  ')).to.equal('123');
		expect(shimlibString.strip('  123')).to.equal('123');
		expect(shimlibString.strip(tab + ' ' + tab + '123 ' + tab + ' ')).to.equal('123');
		expect(shimlibString.strip('    ')).to.equal('');
		expect(shimlibString.strip(tab + ' ' + tab)).to.equal('');
		expect(shimlibString.strip(undefined)).to.equal(undefined);
		expect(shimlibString.strip(null)).to.equal(undefined);
		expect(shimlibString.strip({})).to.equal(undefined);
	});
});
describe('shimlib times', function() {
	var shimlibTimes = require('../../app/shimlib-times');
	
	it('times function', function() {
		var count = 0;
		var func = function() {
			count++;
		};

		shimlibTimes.times(func, 5);
		expect(count).to.equal(5);
	});

	it('times string', function() {
		expect(shimlibTimes.times('a', 5)).to.deep.equal('aaaaa');
	});

	it('times value', function() {
		expect(shimlibTimes.times(undefined, 5)).to.deep.equal([ undefined, undefined, undefined, undefined, undefined ]);
		expect(shimlibTimes.times(null, 4)).to.deep.equal([ null, null, null, null ]);
		expect(shimlibTimes.times(3, 3)).to.deep.equal([3, 3, 3]);
		expect(shimlibTimes.times(6, 2)).to.deep.equal([6, 6]);
		expect(shimlibTimes.times({ obj: true }, 4)).to.deep.equal([
			{ obj: true },
			{ obj: true },
			{ obj: true },
			{ obj: true }
		]);
	});
});
describe('Object integration', function(){
	var shimlibObject = require('../../app/shimlib-object');

	it('keys', function() {
		var arr = [1, 2, 3];

		expect(Object.keys(arr)).to.deep.equal(shimlibObject.keys(arr));
	});
});

describe('Array integration', function(){
	var shimlibArray = require('../../app/shimlib-array');
	var shimlibIs = require('../../app/shimlib-is');

	it('map', function(){
		var arr = [2, 5, 9];
		var func = function(n) {
			return n * 3;
		};

		expect(arr.map(func)).to.deep.equal(shimlibArray.map(func, arr));

	});

	it('foreach', function() {
		var s1 = "";
		var s2 = "";

		var func1 = function(n) {
			s1 = s1 + (n * 2);
		};

		var func2 = function(n) {
			s2 = s2 + (n * 2);
		};

		var arr = [1, 2, 3];

		arr.forEach(func1);
		shimlibArray.forEach(func2, arr);
		expect(s1).to.equal(s2);
		expect(s2).to.equal('246');
	});

	it('is array', function(){
		var arr = [1, 2, 3];

		var both = function(arg) {
			expect(Array.isArray(arg)).to.equal(shimlibIs.isArray(arg));
		};

		both([1, 2 ,3]);
		both([]);
		both('');
		both(1);
		both('abc');
		both(undefined);
		both({});
		both(new Array());
	});

	it('filter', function(){
		var arr = [1, 2, 3, 4, 5, 6, 7];

		var evenFunc = function(n) {
			return n % 2 === 0;
		};

		expect(arr.filter(evenFunc)).to.deep.equal(shimlibArray.filter(evenFunc, arr));
		expect(arr.filter(evenFunc)).to.deep.equal(shimlibArray.filter(evenFunc, arr));
		expect(shimlibArray.filter(evenFunc, arr)).to.deep.equal([2, 4, 6]);
	});

});

describe('Function integration', function(){
	var shimlibFunction = require('../../app/shimlib-function');

	it('bind', function(){
		var obj = {
			lembar: 17
		};

		var func = function() {
			return this.lembar;
		};

		var bound1 = func.bind(obj);
		var bound2 = shimlibFunction.bind(func, obj);

		expect(bound1()).to.equal(bound2());
	});

	it('bind partial apply', function(){
		var obj = {
			talv: 12
		};

		var func = function(arg1, arg2) {
			return this.talv + arg1 + arg2;
		};

		var bound1 = func.bind(obj, 7);
		var bound2 = shimlibFunction.bind(func, obj, 7);

		expect(bound1(4)).to.equal(bound2(4));
		expect(bound2(4)).to.equal(23);

		bound1 = func.bind(obj, 7, 3);
		bound2 = shimlibFunction.bind(func, obj, 7, 3);

		expect(bound1()).to.equal(bound2());
		expect(bound2()).to.equal(22);
	});
});

describe('String integration', function(){
	var shimlibString = require('../../app/shimlib-string');

	it('trim', function() {
		var both = function(arg) {
			expect(arg.trim()).to.equal(shimlibString.trim(arg));
		};

		var tab = String.fromCharCode(9);

		both(' a ');
		both(tab + ' ' + ' a' + tab + ' ' + tab);
		both('123');
		both('  123');
		both(tab + '  123');
		both('123  ');
		both('123  ' + tab);
		both(' 1 2 3 ');
		both(' ');
		both('    ');
		both(tab);
	});
});

describe('Number integration', function(){
	it('to fixed without proper rounding', function(){
		var both = function(num, precision) {
			expect(num.toFixed(precision)).to.equal(shimlibNumber.toFixed(num, precision));
		};

		both(75, 2);
		both(-75, 2);
		both(-1, 3);
		both(1.1111111111111, 6);
		both(0, 1);
		both(0, 2);
		both(-0, 2);
	});

	xit('to fixed proper rounding', function() {
		var both = function(num, precision) {
			expect(num.toFixed(precision)).to.equal(shimlibNumber.toFixed(num, precision));
		};

		both(75.105, 2);
		both(-75.106, 2);
		both(2.00193, 3);
		both(-1.6789, 3);
	});
});

describe("Don't break when builtins altered", function() {
	var shimlibObject = require('../../app/shimlib-object');
	var shimlibString = require('../../app/shimlib-string');

	it('keys still works when hasOwnProperty is changed', function(){
		var obj = {
			climp: 2,
			eln: 'abc'
		};

		expect(shimlibObject.keys(obj)).to.deep.equal(['climp', 'eln']);
		expect(obj.hasOwnProperty).to.be.a('function');

		var s = 'hasOwnProperty';
		obj[s] = 'pask';

		expect(obj.hasOwnProperty).to.be.a('string');
		expect(shimlibObject.keys(obj)).to.deep.equal(['climp', 'eln', 'hasOwnProperty']);
	});

	it('strip still works when replace is changed', function() {
		var s = "  123  ";

		s.replace = 'frewt';

		if(typeof s.replace === "function") {
			return;
		}

		expect(s.replace).to.be.a('string');
		expect(shimlibString.strip(s)).to.equal('1234');
	});

	it('expect alter', function() {
		// Having properties with names like 'undefined', 'true', and 'false'
		// is readable but uncomfortably close to bad syntax. Copy these properties to
		// uppercase versions to help distinguish them from keywords.
		expect(chai.Assertion.prototype.hasOwnProperty('False')).to.equal(false);
		expect(chai.Assertion.prototype.hasOwnProperty('True')).to.equal(false);
		expect(chai.Assertion.prototype.hasOwnProperty('Undefined')).to.equal(false);

		shimlibObject.copyProperty(
			chai.Assertion.prototype, 'false', 
			chai.Assertion.prototype, 'False');

		shimlibObject.copyProperty(
			chai.Assertion.prototype, 'true', 
			chai.Assertion.prototype, 'True');

		shimlibObject.copyProperty(
			chai.Assertion.prototype, 'undefined', 
			chai.Assertion.prototype, 'Undefined');

		expect(chai.Assertion.prototype.hasOwnProperty('False')).to.equal(true);
		expect(chai.Assertion.prototype.hasOwnProperty('True')).to.equal(true);
		expect(chai.Assertion.prototype.hasOwnProperty('Undefined')).to.equal(true);

		expect(1 > 2).to.be.False;
		expect(1 < 2).to.be.True;
		expect(void 0).to.be.Undefined;

		var badExpectation = function() {
			expect(true).to.be.False;
		};

		var badExpectation2 = function() {
			expect(false).to.be.True;
		};

		var badExpectation3 = function () {
			expect({}).to.be.Undefined;
		}

		expect(badExpectation).to.throw(chai.AssertionError);
		expect(badExpectation2).to.throw(chai.AssertionError);
		expect(badExpectation3).to.throw(chai.AssertionError);
	});

});
},{"../../app/shimlib-array":1,"../../app/shimlib-function":2,"../../app/shimlib-is":3,"../../app/shimlib-klass":4,"../../app/shimlib-number":5,"../../app/shimlib-object":6,"../../app/shimlib-qs":7,"../../app/shimlib-string":8,"../../app/shimlib-times":9}]},{},[10])