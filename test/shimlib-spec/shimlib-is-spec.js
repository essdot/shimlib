describe('shimlib is', function() {
	shimlibIs = require('../../app/shimlib-is');

	it('detects arrays', function(){
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

	it('detects functions', function() {
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

	it('detects strings', function(){
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

	it('detects numbers', function(){
		var isn = shimlibIs.isNumber;

		expect(isn(-1)).to.equal(true);
		expect(isn(0)).to.equal(true);
		expect(isn(1)).to.equal(true);
		expect(isn(100000)).to.equal(true);
		
		expect(isn('1')).to.equal(false);
		expect(isn('0xabc')).to.equal(false);
		expect(isn(NaN)).to.equal(false);
		expect(isn(undefined)).to.equal(false);
		expect(isn(null)).to.equal(false);
		expect(isn([])).to.equal(false);
		expect(isn([ 1 ])).to.equal(false);
	});

	it('detects NaN', function() {
		expect(shimlibIs.isNan(NaN)).to.equal(true);
		expect(shimlibIs.isNan(undefined * 3)).to.equal(true);
		expect(shimlibIs.isNan(Number.NaN)).to.equal(true);
		expect(shimlibIs.isNan(1 / 0)).to.equal(false);
	});
});