describe('shimlib times', function() {
	var shimlibTimes = require('../../app/shimlib-times');
	
	it('repeats funtion invocation', function() {
		var count = 0;
		var func = function() {
			count++;
		};

		shimlibTimes.times(func, 5);
		expect(count).to.equal(5);
	});

	it('repeats a string', function() {
		expect(shimlibTimes.times('a', 5)).to.deep.equal('aaaaa');
		expect(shimlibTimes.times('abc', 3)).to.deep.equal('abcabcabc');
		expect(shimlibTimes.times(' ', 5)).to.deep.equal('     ');
		expect(shimlibTimes.times('', 5)).to.deep.equal('');
	});

	it('repeats a value as an array', function() {
		expect(shimlibTimes.times(undefined, 5)).to.deep.equal([ undefined, undefined, undefined, undefined, undefined ]);
		expect(shimlibTimes.times(null, 4)).to.deep.equal([ null, null, null, null ]);
		expect(shimlibTimes.times(3, 3)).to.deep.equal([3, 3, 3]);
		expect(shimlibTimes.times(6, 2)).to.deep.equal([6, 6]);
		expect(shimlibTimes.times({ obj: true }, 4)).to.deep.equal([
			{ obj: true },
			{ obj: true },
			{ obj: true },
			{ obj: true }
		]);
	});
});