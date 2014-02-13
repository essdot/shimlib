# shimlib - A Useful Javascript Library

Shimlib is a Javascript library that does things with functions, arrays, objects, and more. It's a personal project, implementing things I have found necessary or convenient at different times. It can be used to shim missing functionality like Object.keys, Function.prototype.bind, and more. 

Some of its functions are similar to what you'll find in  [underscore.js](http://underscorejs.org/) and  [es5-shim](https://github.com/es-shims/es5-shim). It also includes a simple class library for doing classical inheritance in Javascript, and some very handy serialization/deserialization for query strings.

## Functionality
* Array
	* **map(fn, arr, [thisArg])**: Standard map function. Using values returned from *fn*, transform *arr* into a new array. *fn* is a function that takes an element of *arr* and returns some value. *thisArg* is an optional parameter that will be bound to `this` when fn is called. Otherwise, `this` will be bound to *arr*.

	* **filter(fn, arr, [thisArg])**: Standard filter function. Filter *arr* by passing each element to *fn*. Each element of *arr* will be included in the result if and only if *fn* returns `true`. *thisArg* is an optional parameter that will be bound to `this` when fn is called. Otherwise, `this` will be bound to *arr*.

	* **forEach(fn, arr, [thisArg])**: Standard forEach function. *fn* will be called for each element of *arr*. *thisArg* is an optional parameter that will be bound to `this` when fn is called. Otherwise, `this` will be bound to *arr*.

	* **invoke(arr, methodName)**: Invoke *methodName* as a method of each element of *arr* and return an array of the results of each invocation. *methodName* should be a string. Any extra arguments will be passed on to the method.

	* **pickRandom(arr)**: Returns a randomly-selected element of *arr*.

	* **pluck(arr, propertyName)**: Returns an array representing the value of *propertyName* for each element in *arr*. 

* Function
	* **bind(fn, context)**: Standard bind function. Returns a new function that calls *fn* with *context* bound to `this`.
	* **compose(func1 [, func2...])**: Standard compose function. Compose one or more functions together.
* Is
	* **isArray**
	* **isString**
	* **isFunction**
	* **isNumber**

* Number
	* **toFixed(n, precision)**: Returns a string representing *n* with *precision* digits after the decimal point.  
**Note: Currently, toFixed() truncates the number and does not round it. This does not match the spec.**

* Object
	* **create(o)**: Create a new empty object inheriting from *o*. The prototype of the new object's constructor will be *o*. The new object has no properties of its own but will have all of **o**'s properties due to the magic of prototyping.
	* **extend(destination, sources)**: Replace all values in *destination* with those in one or more *sources*.
	* **keys(o)**: Return a list of the names of *o*'s own properties.
	* **copyProperty(obj, sourceName, destName)**: Take *obj*'s property named *sourceName*, and copy it to *obj.destName*. Convenient for getters which can't be referenced directly without invoking them.

* Query Strings
	* **toQueryString(o)**: Serialize *o* as a query string.
	* **fromQueryString(qs)**: Deserialize *qs* into a Javascript object.

* String
	* **strip(s)**: strip whitespace from beginning and end of *s*.

* Times
	* **timesString(s, times)**: Return a new string where *s* is repeated *times* number of times.
	* **timesValue(val, times)**: Return a new array where *val* is repeated *times* number of times.
	* **times(fn, numTimes, [context])**: Call *fn* *numTimes* times. Optionally, *context* will be bound to `this` when *fn* is called. If *fn* is a string, delegates to *timesString()*. If *fn* is otherwise not a function, delegates to *timesValue()*.

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

car.description === "4 doors, 2 tons";
truck.description === "2 doors, 3 tons";

car.honkHorn() === "beep beep!"
truck.honkHorn() === "beep beep!"
```

**IMPORTANT: DON'T CALL YOUR *klass* WITH `new`.** (It should still work even if you accidentally use `new`. But don't do it.)

`//Don't do this!`  
~~`var car2 = new Auto();`~~


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

* **klass.private(privObj)**: Add private values to this *klass*. Private values are shared amongst all instances of this *klass*.
```javascript
HybridAuto.secret({ keyCombination: 'ABCD1234' });

prius.keyCombination === undefined;
HybridAuto.keyCombination === undefined;
```

* **klass.privateMethod(name, fn)**: Add a new method to *klass* which has access to the private values of the *klass*. *name* is the method's name. When *fn* is invoked on instances of *klass*, *fn* will be passed an object representing the private values of the *klass*, as the last argument to *fn*.
```javascript
var confirmSecret = function(potentialSecret, _private) {
	return _private.keyCombination === potentialSecret;	
};

HybridAuto.privateMethod('confirmSecret', confirmSecret);

prius.confirmSecret('ABCD1234') === true;
```

* **klass.static(staticObj)**: Add static values to this *klass*. Static values are properties of the *klass* itself, not the instances of *klass*.
```javascript
Auto.static({ allUseGasoline: false });

Auto.allUseGasoline === false;
```

## Tests & Tools

Shimlib's unit tests use [mocha](http://visionmedia.github.io/mocha/) and [chai](http://chaijs.com/). There are also integration tests for ensuring that it has the same behavior as native functions. Shimlib aims to work if Javascript builtins have been altered, and provides tests for that too. Shimlib's functionality is split into node-style modules.

Gulp tasks are provided for preparing scripts. Browserify is used to resolve the node modules into a single script for running the specs in the browser and to generate the shimlib standalone build, which can be used in browser or node.

## Installing

    sh ./install.sh

(Installs browserify, and mocha for the test runner)

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
