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