# shimlib - A Useful Javascript Library

Shimlib is a Javascript library that does things with functions, arrays, objects, and more. It's a personal project implementing a variety of functionality that I have found useful at times. It can be used to shim missing functionality like Object.keys, Function.prototype.bind, and more.  It implements functionality similar to [underscore.js](http://underscorejs.org/), [es5-shim](https://github.com/es-shims/es5-shim), and a simple class library for doing classical inheritance in Javascript.

Shimlib's unit tests use [mocha](http://visionmedia.github.io/mocha/) and [chai](http://chaijs.com/). There are also integration tests for ensuring that it has the same behavior as native functions. Shimlib's functionality is split into node-style modules.

Grunt tasks are provided for building, concat/minifying, running tests, etc. Browserify is used to resolve the node modules into a single script.


## Installing

    sh ./install.sh

(Installs grunt-cli, browserify, and mocha for the test runner)

## Running tests

Unit tests can be run on the command line, or in a browser. To run tests on the command line, run 

    npm test 
or 

    grunt test

To run them in a browser, run 

    node bin/serve 
or 

    grunt server 
and browse to [http://localhost:4444](http://localhost:4444).

## Notes

Currently, the toFixed implementation simply truncates and does not do decimal rounding.

## Maintainer

* [Justin Sippel](mailto:justin@sippel.com) 

Twitter: [http://twitter.com/sdotpdx](http://twitter.com/sdotpdx)

GitHub: [http://github.com/essdot](http://github.com/essdot)


## Thanks

The server script and general browser test setup was taken from the wonderful js-assessment by Rebecca Murphy: https://github.com/rmurphey/js-assessment


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
