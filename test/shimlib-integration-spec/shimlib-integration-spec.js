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

		shimlibObject.copyProperty(chai.Assertion.prototype, 'false', 'False');
		shimlibObject.copyProperty(chai.Assertion.prototype, 'true', 'True');
		shimlibObject.copyProperty(chai.Assertion.prototype, 'undefined', 'Undefined');

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