//Prepare testing environment for Mocha tests being run via node
global.chai = require('chai');
global.expect = global.chai.expect;

//Create a fake window & DOM to pass to jQuery
// var window = global.window = require('jsdom').jsdom("<html><body></body></html>").createWindow();
// global.document = window.document;