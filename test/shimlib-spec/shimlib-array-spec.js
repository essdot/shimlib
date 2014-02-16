describe('shimlib array', function() {
	shimlibArray = require('../../app/shimlib-array');

	describe('filter', function() {

		it('filters correctly', function(){
			var evenFunc = function(n) {
				return n % 2 === 0;
			};

			var falseFunc = function() {
				return false;
			};

			expect(shimlibArray.filter(evenFunc, [1, 2, 3, 4, 5, 6])).to.deep.equal([2, 4, 6]);
			expect(shimlibArray.filter(falseFunc, [1, 2, 3, 4, 5, 6])).to.deep.equal([]);
			expect(shimlibArray.filter(evenFunc, [undefined, 2, 4, 6, undefined])).to.deep.equal([ 2, 4, 6 ]);
		});

		it('passes arguments to callback', function() {
			var funcResults = [];
			var func = function(item, index, arr) {
				var isEven = item % 2 === 0;
				funcResults.push({
					item: item,
					index: index,
					arr: arr,
					isEven: isEven
				});

				return isEven;
			};

			var arr = [ 4, 5, 6 ];

			var filterResult = shimlibArray.filter(func, arr);

			expect(filterResult).to.deep.equal([ 4, 6 ]);
			expect(funcResults).to.deep.equal([
				{
					item: 4,
					isEven: true,
					index: 0,
					arr: [ 4, 5, 6 ]
				},

				{
					item: 5,
					isEven: false,
					index: 1,
					arr: [ 4, 5, 6 ]
				},

				{
					item: 6,
					isEven: true,
					index: 2,
					arr: [ 4, 5, 6 ]
				}
			]);
		});

		it('binds thisArg in callback function', function() {
			var obj = {
				str: 'my ',
				arr: []
			};

			var func = function(s) {
				this.arr.push(this.str + s);
				return true;
			};

			var arr = [ 'whip', 'lambo', 'hoopty' ];

			shimlibArray.filter(func, arr, obj);

			expect(obj.arr).to.deep.equal([ 'my whip', 'my lambo', 'my hoopty' ]);
		});

		it('iterates on non-array object', function() {
			var iterateObject = {
				prop1: 'abc',
				prop2: 'def',
				'0': 'first value',
				'1': 'second value',
				'2': 'third value'
			};

			var s = '';

			var func = function(val) {
				s = s + val + ', ';

				return val.indexOf('i') !== -1;
			};

			var filterResult = shimlibArray.filter(func, iterateObject);
			expect(filterResult).to.deep.equal([]);
			expect(s).to.equal('');

			iterateObject.length = 3;
			filterResult = shimlibArray.filter(func, iterateObject);
			expect(filterResult).to.deep.equal([ 'first value', 'third value' ]);
			expect(s).to.equal('first value, second value, third value, ');
		});

		it('skips nonexistent elements', function() {
			var arr = [ 1, 2, 3, 4 ];
			arr[10] = 5;
			var testArr = new Array(10);
			testArr[0] = 1;
			testArr[1] = 2;
			testArr[2] = 3;
			testArr[3] = 4;
			testArr[10] = 5;

			var indices = [];

			var func = function(n, index) {
				indices.push(index);
				return true;
			};

			expect(shimlibArray.filter(func, arr)).to.deep.equal([ 1, 2, 3, 4, 5 ]);
			expect(indices).to.deep.equal([ 0, 1, 2, 3, 10 ]);
		});
	});
	
	describe('forEach', function(){

		it('calls function for each element', function(){
			var arr = [ 1, 2, 3, 4, undefined ];

			var s = "";
			var func = function(val){
				s = s + (val * 2).toString();
			};

			shimlibArray.forEach(func, arr);
			expect(s).to.equal("2468NaN");
		});

		it('passes arguments to callback', function(){
			var funcResults = [];
			var func = function(item, index, arr) {
				funcResults.push({
					item: item,
					index: index,
					arr: arr
				});
			};

			var arr = [ 'Ghostface', 'Method Man', 'Raekwon' ];

			shimlibArray.forEach(func, arr);

			expect(funcResults).to.deep.equal([
				{
					item: 'Ghostface',
					index: 0,
					arr: [ 'Ghostface', 'Method Man', 'Raekwon' ]
				},

				{
					item: 'Method Man',
					index: 1,
					arr: [ 'Ghostface', 'Method Man', 'Raekwon' ]
				},

				{
					item: 'Raekwon',
					index: 2,
					arr: [ 'Ghostface', 'Method Man', 'Raekwon' ]
				}
			]);
		});

		it('binds thisArg in callback function', function(){
			var obj = {
				str: 'get that ',
				arr: []
			};

			var func = function(s) {
				this.arr.push(this.str + s);
			};

			var arr = [ 'fetty', 'cheddar', 'guap' ];

			shimlibArray.forEach(func, arr, obj);

			expect(obj.arr).to.deep.equal([ 'get that fetty', 'get that cheddar', 'get that guap' ]);
		});

		it('iterates on non-array object', function() {
			var iterateObject = {
				prop1: 'abc',
				prop2: 'def',
				'0': 'first value',
				'1': 'second value',
				'2': 'third value'
			};

			var s = '';

			var func = function(val) {
				if (val === undefined) { return; }
				s = s + val + ', ';
			};

			shimlibArray.forEach(func, iterateObject);
			expect(s).to.equal('');

			iterateObject.length = 3;

			shimlibArray.forEach(func, iterateObject);
			expect(s).to.equal('first value, second value, third value, ');
		});

		it('skips nonexistent elements', function() {
			var arr = [ 1, 2, 3, 4 ];
			arr[10] = 5;
			var testArr = new Array(10);
			testArr[0] = 0;
			testArr[1] = 1;
			testArr[2] = 2;
			testArr[3] = 3;
			testArr[10] = 10;

			var indices = [];

			var func = function(n, index, array) {
				indices.push(index);
			};

			shimlibArray.forEach(func, arr);

			expect(indices).to.deep.equal([ 0, 1, 2, 3, 10 ]);
		});

	});

	describe('some', function() {
		it('evaluates correctly', function() {
			var arr1 = [ 1, 2, 3 ];
			var arr2 = [ 5, 7, 9 ];

			var isEven = function(n) {
				return n % 2 === 0;
			};

			expect(shimlibArray.some(isEven, arr1)).to.equal(true);
			expect(shimlibArray.some(isEven, arr2)).to.equal(false);
		});

		it('iterates on non-array objects', function() {
			var obj1 = {
				num: 2,
				test: 4,
				'0': 1,
				'1': 3,
				'2': 5
			};

			var obj2 = {
				'0': 2,
				'1': 7
			};

			var isEven = function(n) {
				return n % 2 === 0;
			};

			expect(shimlibArray.some(isEven, obj1)).to.equal(false);
			expect(shimlibArray.some(isEven, obj2)).to.equal(false);

			obj1.length = 3;
			obj2.length = 2;

			expect(shimlibArray.some(isEven, obj1)).to.equal(false);
			expect(shimlibArray.some(isEven, obj2)).to.equal(true);
		});

		it('binds thisArg to callback function', function() {
			var arr = [
				{
					shoes: 'Timbos',
					jeans: 'Pelle Pelle'
				},
				{
					shoes: 'Ones',
					jeans: 'JNCO'
				}
			];

			var fn = function(o) {
				return this.jeans === o.jeans;
			};

			var obj = {
				shoes: 'Yeezy',
				jeans: 'Pelle Pelle'
			};

			expect(shimlibArray.some(fn, arr, obj)).to.equal(true);
		});

		it('passes arguments to callback', function(){
			var funcResults = [];
			var func = function(item, index, arr) {
				funcResults.push({
					item: item,
					index: index,
					arr: arr
				});

				return item === 'Raekwon';
			};

			var arr = [ 'Ghostface', 'Method Man', 'Raekwon' ];

			expect(shimlibArray.some(func, arr)).to.equal(true);

			expect(funcResults).to.deep.equal([
				{
					item: 'Ghostface',
					index: 0,
					arr: [ 'Ghostface', 'Method Man', 'Raekwon' ]
				},

				{
					item: 'Method Man',
					index: 1,
					arr: [ 'Ghostface', 'Method Man', 'Raekwon' ]
				},

				{
					item: 'Raekwon',
					index: 2,
					arr: [ 'Ghostface', 'Method Man', 'Raekwon' ]
				}
			]);
		});

		it('handles non-boolean returns', function() {
			var arr = [ 0, 0, 0, 1 ];
			var arr2 = [ '', null, 0 ];

			var fn = function(val) {
				return val;
			};

			expect(shimlibArray.some(fn, arr)).to.equal(true);
			expect(shimlibArray.some(fn, arr2)).to.equal(false);
		});
	});

	describe('map', function() {

		it('maps correctly', function(){
			var doubleFunc = function(n) {
				return n * 2;
			};

			var toString = function(n) {
				return n.toString();
			};

			expect(shimlibArray.map(doubleFunc, [1, 2, 3])).to.deep.equal([2, 4, 6]);

			expect(shimlibArray.map(toString, [6, 7, 8])).to.deep.equal(['6', '7', '8']);
		});

		it('binds thisArg to callback function', function(){
			var func = function(n) {
				return this.str + n.toString();
			};

			var obj = {
				str: 'abc'
			};

			var arr = [1, 2, 3];

			expect(shimlibArray.map(func, arr, obj)).to.deep.equal(['abc1', 'abc2', 'abc3' ]);
		});

		it('passes arguments to callback', function(){
			var func = function(item, index, arr) {
				return {
					item: item,
					index: index,
					arr: arr
				};
			};

			var arr = [ 'hello', 'goodbye', 'arrivederci' ];

			expect(shimlibArray.map(func, arr)).to.deep.equal([
				{
					item: 'hello',
					index: 0,
					arr: [ 'hello', 'goodbye', 'arrivederci' ]
				},

				{
					item: 'goodbye',
					index: 1,
					arr: [ 'hello', 'goodbye', 'arrivederci' ]
				},

				{
					item: 'arrivederci',
					index: 2,
					arr: [ 'hello', 'goodbye', 'arrivederci' ]
				}
			]);
		});

		it('iterates on non-array object', function() {
			var iterateObject = {
				prop1: 'abc',
				prop2: 'def',
				'0': 'first value',
				'1': 'second value',
				'2': 'third value'
			};

			var func = function(s) {
				return s;
			};

			var mapResult = shimlibArray.map(func, iterateObject);
			expect(mapResult).to.deep.equal(undefined);

			iterateObject.length = 3;
			mapResult = shimlibArray.map(func, iterateObject);
			expect(mapResult).to.deep.equal([ 'first value', 'second value', 'third value' ]);
		});

		it('works when original array is altered by callback', function(){
			var arr = [ 1, 2, 3, 4 ];

			var fn = function(n, index, list) {
				if (n === 3) {
					list.push(3);
				}

				return n;
			};

			expect(shimlibArray.map(fn, arr)).to.deep.equal([ 1, 2, 3, 4 ]);
		});

		it('skips nonexistent elements', function() {
			var arr = [ 1, 2, 3, 4 ];
			arr[10] = 5;
			var testArr = new Array(10);
			testArr[0] = 0;
			testArr[1] = 1;
			testArr[2] = 2;
			testArr[3] = 3;
			testArr[10] = 10;

			var func = function(n, index, array) {
				return index;
			};

			expect(shimlibArray.map(func, arr)).to.deep.equal(testArr);
		});
	});

	describe('invoke', function() {
		it('invokes method on all elements', function() {
			var func = function(n) {
				return this.number + n;
			};

			var obj1  = { addFunc: func, number: 5 };
			var obj2  = { addFunc: func, number: 13 };
			var obj3  = { addFunc: func, number: 82 };
			var arr  = [ obj1, obj2, obj3 ];

			var invokeResult = shimlibArray.invoke(arr, 'addFunc', 17);
			expect(invokeResult).to.deep.equal([ 22, 30, 99 ]);
		});
	});

	describe('pickRandom', function() {
		it('chooses random element', function(){
			var list = [1, 2, 3, 4, 5, 6, 7, 8];
			var randomPick = shimlibArray.pickRandom(list);
			var index = list.indexOf(randomPick);

			expect(index).to.be.within(0, list.length - 1);
			expect(list[index]).to.equal(randomPick);
		});
	});

	describe('pluck', function() {
		it('projects over array correctly', function() {
			var arr = [
				{ name: 'John', age: 34 },
				{ name: 'Jack', age: 31 },
				{ name: 'Jane', age: 20 },
				{ name: 'Jan', age: 22 }
			];

			expect(shimlibArray.pluck(arr, 'name')).to.deep.equal([ 'John', 'Jack', 'Jane', 'Jan' ]);
			expect(shimlibArray.pluck(arr, 'age')).to.deep.equal([ 34, 31, 20, 22 ]);
		});

		it('skips undefined elements', function() {
			var arr2 = [
				{ name: 'Jern', age: 44 },
				{ name: 'Jold', age: 54 },
				undefined,
				{ name: 'Jilm', age: 29 }
			];

			expect(shimlibArray.pluck(arr2, 'name')).to.deep.equal([ 'Jern', 'Jold', 'Jilm' ]);
			expect(shimlibArray.pluck(arr2, 'age')).to.deep.equal([ 44, 54, 29 ]);
			expect(shimlibArray.pluck(arr2, 'yitta')).to.deep.equal([]);
		});
	});
});