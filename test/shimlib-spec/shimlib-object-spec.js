describe('shimlib object', function() {
	var shimlibObject = require('../../app/shimlib-object');
	
	it('extend', function() {
		var empty = {};
		var objA = { name: 'Jeff', job: 'Clerk', age: 31 };
		var objB = { age: 33, city: 'Boston' };

		shimlibObject.extend(objA, objB);
		expect(objA.age).to.equal(33);
		expect(objA.city).to.equal('Boston');
		expect(objA.job).to.equal('Clerk');

		shimlibObject.extend(empty, objB);
		expect(empty.city).to.equal('Boston');
		expect(empty.age).to.equal(33);
	});

	it('extend multiple sources', function() {
		var coffee = {
			espresso: 'espresso',
			cappuccino: 'cappuccino',
			caffeine: true
		};

		var juice = {
			orange: 'orange',
			grapefruit: 'grapefruit',
			caffeine: false
		};

		var drinks = {};
		shimlibObject.extend(drinks, coffee, juice);

		expect(drinks.espresso).to.equal('espresso');
		expect(drinks.orange).to.equal('orange');
		expect(drinks.caffeine).to.equal(false);
	});

	it('keys', function() {
		var obj = {
			derf: 7,
			whin: 'abc',
			varn: []
		};

		expect(shimlibObject.keys(obj)).to.deep.equal(['derf', 'whin', 'varn']);
		
		var arr = [5, 6, 7];
		expect(shimlibObject.keys(arr)).to.deep.equal(['0', '1', '2']);
		
		expect(shimlibObject.keys({})).to.deep.equal([]);
		
		//obj2's prototype is obj
		var obj2 = Object.create(obj);
		expect(obj2.derf).to.equal(7);
		expect(obj2.whin).to.equal('abc');
		expect(shimlibObject.keys(obj2)).to.deep.equal([]);
	});


	it('create', function(){
		var obj = {
			bumbo: 7,
			wulgus: 'abc',
			bibby: []
		};
		var obj2 = shimlibObject.create(obj);
		var obj3 = shimlibObject.create(obj);
		var arrayObj = shimlibObject.create([1, 2, 3]);

		expect(shimlibObject.create(undefined)).to.deep.equal({});
		expect(shimlibObject.create(null)).to.deep.equal({});
		expect(shimlibObject.create({})).to.deep.equal({});
		
		expect(obj2.bumbo).to.equal(7);
		expect(obj2.wulgus).to.equal('abc');
		expect(obj2.bibby).to.deep.equal([]);
		expect(obj2.hasOwnProperty('bumbo')).to.equal(false);
		expect(obj2.hasOwnProperty('wulgus')).to.equal(false);
		expect(obj2.hasOwnProperty('bibby')).to.equal(false);

		expect(obj2).to.deep.equal(obj3);
		expect(obj2).to.not.equal(obj3);

		expect(arrayObj[0]).to.equal(1);
		expect(arrayObj['1']).to.equal(2);
		expect(arrayObj[2]).to.equal(3);
		expect(arrayObj.length).to.equal(3);
		expect(arrayObj.hasOwnProperty('0')).to.equal(false);
		expect(arrayObj.hasOwnProperty('1')).to.equal(false);
		expect(arrayObj.hasOwnProperty('2')).to.equal(false);
		expect(arrayObj.hasOwnProperty('length')).to.equal(false);
		expect(Array.isArray(arrayObj)).to.equal(false);
	});

	it('copy property', function() {
		var obj = {
			team: 'Supersonics'
		};

		var obj2 = {
			team: 'Lakers'
		};

		Object.defineProperty(obj, 'myTeam', {
			get: function() {
				return this.team;
			}
		});

		expect(obj.myTeam).to.equal('Supersonics');

		expect(obj.hasOwnProperty('myTeam2')).to.equal(false);

		shimlibObject.copyProperty(obj, 'myTeam', obj, 'myTeam2');
		shimlibObject.copyProperty(obj, 'myTeam', obj2, 'myTeam');

		expect(obj.hasOwnProperty('myTeam2')).to.equal(true);
		expect(obj2.hasOwnProperty('myTeam')).to.equal(true);

		expect(obj.myTeam2).to.equal('Supersonics');
		expect(obj2.myTeam).to.equal('Lakers');
	});
});