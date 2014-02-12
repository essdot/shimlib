# shimlib - A Useful Javascript Library

Shimlib is a Javascript library that does things with functions, arrays, objects, and more. It's a personal project, implementing things I have found necessary or convenient at different times. It can be used to shim missing functionality like Object.keys, Function.prototype.bind, and more. 

Some of its functions are similar to what you'll find in  [underscore.js](http://underscorejs.org/) and  [es5-shim](https://github.com/es-shims/es5-shim). It also includes a simple class library for doing classical inheritance in Javascript, and some very handy serialization/deserialization for query strings.

Shimlib's unit tests use [mocha](http://visionmedia.github.io/mocha/) and [chai](http://chaijs.com/). There are also integration tests for ensuring that it has the same behavior as native functions. Shimlib aims to work if Javascript builtins have been altered, and provides tests for that too. Shimlib's functionality is split into node-style modules.

Gulp tasks are provided for preparing scripts. Browserify is used to resolve the node modules into a single script for running the specs in the browser and to generate the shimlib standalone build, which can be used in browser or node.


## Installing

    sh ./install.sh

(Installs browserify, and mocha for the test runner)

## Running tests

Unit tests can be run on the command line, or in a browser. To run tests on the command line, run `npm test` or `mocha`. To run the tests in a browser, run `node bin/serve` and browse to [http://localhost:4444](http://localhost:4444).

## Notes

Currently, the toFixed implementation simply truncates and does not do decimal rounding.

## Maintainer

* [Justin Sippel](mailto:justin@sippel.com) 

GitHub: [http://github.com/essdot](http://github.com/essdot)


## Thanks

The server script and general browser test setup was taken from the wonderful js-assessment by Rebecca Murphey: https://github.com/rmurphey/js-assessment


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
