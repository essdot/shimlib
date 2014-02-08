describe('shimlib function', function() {
	var shimlibFunction = require('shimlib-function');
	
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