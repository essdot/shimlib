describe('Object integration', function(){
	var shimlibObject = require('../../app/shimlib-object');

	it('keys matches Object.keys', function() {
		var arr = [1, 2, 3];

		expect(Object.keys(arr)).to.deep.equal(shimlibObject.keys(arr));
	});
});

describe('Array integration', function(){
	var shimlibArray = require('../../app/shimlib-array');
	var shimlibIs = require('../../app/shimlib-is');

	it('shimlibMap matches Array.prototype.map', function(){
		var arr1 = [ 2, 5, 9 ];
		var arr2 = [ 7, 9 ];
		arr2[7] = 11;

		var func = function(n) {
			return n * 3;
		};

		expect(arr1.map(func)).to.deep.equal([ 6, 15, 27 ]);
		expect(shimlibArray.map(func, arr1)).to.deep.equal([ 6, 15, 27 ]);
		expect(arr1.map(func)).to.deep.equal(shimlibArray.map(func, arr1));

		var testArr = new Array(8);
		testArr[0] = 21;
		testArr[1] = 27;
		testArr[7] = 33;

		var testArrKeys = [ '0', '1', '7' ];

		expect(Object.keys(arr2.map(func))).to.deep.equal(testArrKeys);
		expect(Object.keys(shimlibArray.map(func, arr2))).to.deep.equal(testArrKeys);

		expect(arr2.map(func)).to.have.property('0');
		expect(arr2.map(func)).to.have.property('1');
		expect(arr2.map(func)).to.have.property('7');
		expect(shimlibArray.map(func, arr2)).to.have.property('0');
		expect(shimlibArray.map(func, arr2)).to.have.property('1');
		expect(shimlibArray.map(func, arr2)).to.have.property('7');

		expect(arr2.map(func)).not.to.have.property('2');
		expect(arr2.map(func)).not.to.have.property('3');
		expect(arr2.map(func)).not.to.have.property('4');
		expect(arr2.map(func)).not.to.have.property('5');
		expect(arr2.map(func)).not.to.have.property('6');
		expect(shimlibArray.map(func, arr2)).not.to.have.property('2');
		expect(shimlibArray.map(func, arr2)).not.to.have.property('3');
		expect(shimlibArray.map(func, arr2)).not.to.have.property('4');
		expect(shimlibArray.map(func, arr2)).not.to.have.property('5');
		expect(shimlibArray.map(func, arr2)).not.to.have.property('6');

		expect(arr2.map(func)).to.deep.equal(testArr);
		expect(shimlibArray.map(func, arr2)).to.deep.equal(testArr);
		expect(arr2.map(func)).to.deep.equal(shimlibArray.map(func, arr2));
	});

	it('shimlibForeach matches Array.prototype.forEach', function() {
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

	it('shimlibIsArray matches Array.isArray', function(){
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

	it('shimlibFilter matches Array.prototype.filter', function(){
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

	it('bind matches Function.prototype.bind', function(){
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

	it('bind partial apply matches Function.prototype.bind', function(){
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

	it('shimlibTrim matches String.prototype.trim', function() {
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
	it('to fixed matches Number.prototype.toFixed, without proper rounding', function(){
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

	xit('to fixed matches Number.prototype.toFixed, with proper rounding', function() {
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

	it('chai expectations can be copied to uppercase versions', function() {
		// Chai offers BDD assertions such as `expect(val).to.be.true` .
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