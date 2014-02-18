# shimlib - A Useful Javascript Library

Shimlib is a Javascript library that does things with functions, arrays, objects, and more. It's a personal project, implementing things I have found necessary or convenient at different times. It can be used to shim missing functionality like Object.keys, Function.prototype.bind, and more. 

Some of its functions are similar to what you'll find in  [underscore.js](http://underscorejs.org/) and  [es5-shim](https://github.com/es-shims/es5-shim). It also includes a simple class library for doing classical inheritance in Javascript, and some very handy serialization/deserialization for query strings.

## Functionality

(Note - there are links to the ECMAScript spec below. It's a huge document and takes a long time to load before it can jump to the specific section linked to.)

#### Array

* **shimlib.map(arr, fn [, thisArg])**: Standard map function. Using values returned from *fn*, transform *arr* into a new array. *fn* is a function that takes an element of *arr* and returns some value. *thisArg* is an optional parameter that will be bound to `this` when *fn* is called. Otherwise, `this` will be bound to *arr*. Can be used as a shim for [Array.prototype.map](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.19).

* **shimlib.filter(arr, fn [, thisArg])**: Standard filter function. Filter *arr* by passing each element to *fn*. Each element of *arr* will be included in the result if *fn* returns a truthy value. *thisArg* is an optional parameter that will be bound to `this` when *fn* is called. Otherwise, `this` will be bound to *arr*. Can be used as a shim for [Array.prototype.filter](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20).

* **shimlib.forEach(arr, fn [, thisArg])**: Standard forEach function. *fn* will be called for each element of *arr*. *thisArg* is an optional parameter that will be bound to `this` when *fn* is called. Otherwise, `this` will be bound to *arr*. Can be used as a shim for [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18).

* **shimlib.some(arr, fn [, thisArg])**: Standard some function. Returns `true` if the result of calling *fn* is truthy for at least one element of *arr*. Returns `false` otherwise. *thisArg* is an optional parameter that will be bound to `this` when *fn* is called. Otherwise, `this` will be bound to *arr*. Can be used as a shim for [Array.prototype.some](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.17).

* **shimlib.every(arr, fn [, thisArg])**: Standard every function. Returns `true` if no falsy values were found after calling *fn* for every element of *arr*. Returns `false` otherwise. *thisArg* is an optional parameter that will be bound to `this` when *fn* is called. Otherwise, `this` will be bound to *arr*. Can be used as a shim for [Array.prototype.every](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.16).

* **shimlib.invoke(arr, methodName [, extraArg1...])**: Invoke *methodName* as a method of each element of *arr* and return an array of the results of each invocation. *methodName* should be a string. Any extra arguments will be passed on to the method.

* **shimlib.pickRandom(arr)**: Returns a randomly-selected element of *arr*.

* **shimlib.pluck(arr, propertyName)**: Gets the value of *propertyName* from each element in *arr* and returns a new array with the values.

#### Function

* **shimlib.bind(fn, context)**: Standard bind function. Returns a new function that calls *fn* with *context* bound to `this`.

* **shimlib.compose(func1 [, func2...])**: Standard compose function. Compose one or more functions together.

#### Is

* **shimlib.isArray(o)**: Returns `true` if o is an array, `false` otherwise. Can be used as a shim for Array.isArray.
* **shimlib.isString(s)**: Returns `true` if *s* is a string, `false` otherwise.
* **shimlib.isFunction(f)**: Returns `true` if *f* is a function, `false` otherwise.
* **shimlib.isNan(n)**: Returns `true` if *n* is NaN. More accurate implementation than native `isNaN`, which has misleading behavior.
* **shimlib.isNumber(n)**: Returns `true` if *n* is a number, `false` otherwise.

#### Number

* **shimlib.toFixed(n, precision)**: Returns a string representing *n* with *precision* digits after the decimal point.  
**Note: Currently, toFixed() truncates the number and does not round it. This does not match [the spec](http://www.ecma-international.org/ecma-262/5.1/#sec-15.7.4.5).**

#### Object

* **shimlib.create(o)**: Create a new object inheriting from *o*. The new object's prototype will be *o*. Can be used as a shim for [Object.create](http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.3.5).

* **shimlib.extend(destination, sources)**: Replace all values in *destination* with those in one or more *sources*.

* **shimlib.keys(o)**: Return a list of the names of *o*'s own properties.

* **shimlib.copyProperty(sourceObj, sourceName, destObj, destName)**: Take *sourceObj*'s property named *sourceName*, and copy it to *destObj.destName*. Convenient for getters which can't be referenced directly without invoking them.

* **shimlib.without(o, keys)**: Return a new object with *o*'s properties, except the properties in *keys*.

#### Query Strings

Shimlib's query string functionality handles arrays and numbers. Empty query string values are deserialized as empty strings (`''`).

* **shimlib.toQueryString(o)**: Serialize *o* as a query string.

* **shimlib.fromQueryString(qs)**: Deserialize *qs* into a Javascript object. *qs* can be just a query string, or a URI with a query string (*fromQueryString* will disregard the rest of the URI).

```javascript
var qs = 'section=45&id=abc&arr=1&arr=2&arr=3&empty';
var qsObj = { section: 45, id: 'abc', arr: [1, 2, 3], empty: '' };

shimlib.toQueryString(qsObj) === qs
// returns an object with properties like qsObj
shimlib.fromQueryString(qs);
```

#### String
* **shimlib.strip(s)**: strip whitespace from beginning and end of *s*.

#### Times
* **shimlib.times(arg, numTimes, [context])**
	* If arg is a function, call *arg* *numTimes* times. Optionally, *context* will be bound to `this` when *fn* is called. 
	* If *arg* is a string, returns a new string with *arg* repeated *numTimes* times. 
	* If *arg* is otherwise not a function, returns an array of length *times*, with all elements equal to *arg*.

```javascript
//logs 'hi' three times
shimlib.times(function() { console.log('hi'); }, 3);

// returns 'abcabcabc'
shimlib.times('abc', 3);

// returns [null, null, null, null]
shimlib.times(null, 4);
```

#### Klass

Shimlib provides a simple class maker for doing classical-style inheritance in Javascript.

* **shimlib.klass(methodsAndProperties)**: Returns a factory function (not a constructor), representing the klass, that will create a new instance of the klass when called. If *methodsAndProperties* contains an *initialize* function, *initialize* will be called on every new instance of *klass*.

```javascript
var Auto = shimlib.klass({ 
	hasWheels: true,
	honkHorn: function() {
		return "beep beep!";
	},
	initialize: function() {
		this.description = this.numberOfDoors + ' doors, ' + this.weightInTons + ' tons';
	}
});

var car = Auto({ numberOfDoors: 4, weightInTons: 2 });
var truck = Auto({ numberOfDoors: 2, weightInTons: 3 });

car.description === "4 doors, 2 tons"
truck.description === "2 doors, 3 tons"

car.honkHorn() === "beep beep!"
truck.honkHorn() === "beep beep!"
```

**IMPORTANT: DON'T CALL YOUR *klass* WITH `new`:**

`//Don't do this!`  
~~`var car2 = new Auto();`~~  

(It should still work even if you accidentally use `new`. But don't do it.)

* **klass.extend(methodsAndProperties)**: Creates a new klass with all the methods and properties from *klass*, extended with the specified methods and properties. The new klass will have a property *$super* that refers to the parent klass.
```javascript
var HybridAuto = Auto.extend({
	hybridEngine: true
});

var prius = HybridAuto({ numberOfDoors: 4, weightInTons: 0 });
prius.hasWheels === true;
prius.honkHorn === "beep beep!";
prius.description === "4 doors, 0 tons";
prius.hybridEngine === true;
HybridAuto.$super === Auto;
```

* **klass.private(privObj)**: Add private values to this *klass*. Private values are shared between all instances of this *klass*.
```javascript
HybridAuto.private({ keyCombination: 'ABCD1234' });

prius.keyCombination === undefined;
HybridAuto.keyCombination === undefined;
```

* **klass.privateMethod(name, fn)**: Add a new method to instances of *klass* which has access to the private values of *klass*. *name* is the method's name. When the private method is invoked on instances of *klass*, the private method will be passed an object representing the private values of the *klass*, as the last argument to the method.
```javascript
HybridAuto.privateMethod('confirmSecret', function(potentialSecret, _private) {
	return _private.keyCombination === potentialSecret;
};

prius.confirmSecret('ABCD1234') === true;
```

* **klass.static(staticObj)**: Add static values or methods to this *klass*. Adds properties to *klass* itself, not the instances of *klass*.
```javascript
Auto.static({ allUseGasoline: false });

Auto.allUseGasoline === false;
```

___

## Using in browser

[min/shimlib.min.js](min/shimlib.min.js) is the standalone build that can be used in web pages. It will set the global variable 'shimlib'.

## Tests & Tools

Shimlib's unit tests use [mocha](http://visionmedia.github.io/mocha/) and [chai](http://chaijs.com/). There are also integration tests for ensuring that it has the same behavior as native functions. Shimlib aims to work if Javascript builtins have been altered, and provides tests for that too. Shimlib's functionality is split into node-style modules.

Gulp tasks are provided for preparing scripts. Browserify is used to resolve the node modules into a single script for running the tests in the browser and to generate the shimlib standalone build, which can be used in browser or node.

## Installing
Run `sh ./install.sh` to install Browserify, and mocha for the test runner.

## Running tests

Unit tests can be run on the command line, or in a browser. To run tests on the command line, run `npm test` or `mocha`. To run the tests in a browser, run `node bin/serve` and browse to [http://localhost:4444](http://localhost:4444).

## Notes

Currently, the toFixed implementation simply truncates and does not do decimal rounding. This does not match the [spec for Number.prototype.toFixed](http://www.ecma-international.org/ecma-262/5.1/#sec-15.7.4.5).

## Maintainer

* [Justin Sippel](mailto:justin@sippel.com) 

GitHub: [http://github.com/essdot](http://github.com/essdot)


## Thanks

The server script and general browser test setup was taken from the wonderful js-assessment by Rebecca Murphey: https://github.com/rmurphey/js-assessment

Some alterations were made to the server script for error handling.


## Contributing

Further contributions/contributors are not expected, but submit a pull request if you like.


# License

Copyright &copy; 2014 Justin Sippel

This work is licensed under the [Creative Commons Attribution-Share Alike 3.0](http://creativecommons.org/licenses/by-sa/3.0/)
license. You are free to share and remix the work, and to use it for commercial
purposes under the following conditions:

- *Attribution* — You must attribute the work in the manner specified by the
  author or licensor (but not in any way that suggests that they endorse you or
  your use of the work).
- *Share Alike* — If you alter, transform, or build upon this work, you may
  distribute the resulting work only under the same or similar license to this
  one.

Any of these conditions can be waived if you get permission from the copyright
holder.
