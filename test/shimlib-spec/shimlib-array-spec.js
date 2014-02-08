describe('shimlib array', function() {
	shimlibArray = require('shimlib-array');

	it('filter', function(){
		var evenFunc = function(n) {
			return n % 2 === 0;
		};

		var falseFunc = function(n) {
			return false;
		};

		expect(shimlibArray.filter(evenFunc, [1, 2, 3, 4, 5, 6])).to.deep.equal([2, 4, 6]);
		expect(shimlibArray.filter(falseFunc, [1, 2, 3, 4, 5, 6])).to.deep.equal([]);
	});

	it('foreach', function(){
		var arr = [1, 2, 3, 4];

		var s = "";
		var func = function(val){
			s = s + (val * 2).toString();
		};

		shimlibArray.forEach(func, arr);
		expect(s).to.equal("2468");
	});

	it('invoke', function() {
		var count = 0;
		var s = "s";

		var countFunc = function(inc) {
			if(inc) {
				count = count + inc;
			} else {
				count ++;
			}
		};

		var stringFunc = function(st, st2) {
			s = s + this.name + st + st2;
		};

		var obj  = { count: countFunc, name: 'ttt' };
		var obj2 = { count: countFunc, name: 'dave' };
		var obj3 = { count: countFunc, name: 'que' };
		var arr  = [ obj, obj2, obj3 ];

		shimlibArray.invoke('count', arr, 17);
		expect(count).to.equal(51);

		shimlibArray.invoke(stringFunc, arr, ['33', '-']);
		expect(s).to.equal('sttt33-dave33-que33-');

		var result  = shimlibArray.invoke('toString', [1, 2, 3]);
		expect(result).to.deep.equal(['1', '2', '3']);
	});

	it('map', function(){
		var doubleFunc = function(n) {
			return n * 2;
		};

		var toString = function(n) {
			return n.toString();
		};

		expect(shimlibArray.map(doubleFunc, [1, 2, 3])).to.deep.equal([2, 4, 6]);

		expect(shimlibArray.map(toString, [6, 7, 8])).to.deep.equal(['6', '7', '8']);
	});

	it('pick random', function(){
		var list = [1, 2, 3, 4, 5, 6, 7, 8];
		var randomPick = shimlibArray.pickRandom(list);
		var index = list.indexOf(randomPick);

		expect(index).to.be.within(0, list.length - 1);
		expect(list[index]).to.equal(randomPick);
	});

	it('pluck', function() {
		var arr = [
			{ name: 'John', age: 34 },
			{ name: 'Jack', age: 31 },
			{ name: 'Jane', age: 20 },
			{ name: 'Jan', age: 22 }
		];

		var arr2 = [
			{ name: 'Jern', age: 44 },
			{ name: 'Jold', age: 54 },
			undefined,
			{ name: 'Jilm', age: 29 }
		];

		expect(shimlibArray.pluck(arr, 'name')).to.deep.equal([ 'John', 'Jack', 'Jane', 'Jan' ]);
		expect(shimlibArray.pluck(arr, 'age')).to.deep.equal([ 34, 31, 20, 22 ]);

		expect(shimlibArray.pluck(arr2, 'name')).to.deep.equal([ 'Jern', 'Jold', 'Jilm' ]);
		expect(shimlibArray.pluck(arr2, 'age')).to.deep.equal([ 44, 54, 29 ]);
		expect(shimlibArray.pluck(arr2, 'yitta')).to.deep.equal([]);
	});
});