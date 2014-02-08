describe('shimlib klass', function() {
	shimlibKlass = require('shimlib-klass');
	
	it('klass', function(){
		var Animal = shimlibKlass.klass({
			animalKind: undefined,
			callSound: undefined,

			doCall: function() {
				return this.callSound + "!!!";
			},

			getKind: function() {
				return this.animalKind;
			}
		});

		var Auto = shimlibKlass.klass({
				autoKind: undefined,
				hornSound: undefined,
				tootHorn: function () {
					return this.hornSound + '!!!';
				},
			},
			{
				privateVal: 'shhh'
			}
		);

		var tiger = Animal({ animalKind: 'tiger', callSound: 'roar' });
		var elephant = Animal({ animalKind: 'elephant', callSound: 'braaamp' });

		expect(tiger.doCall()).to.equal('roar!!!');
		expect(tiger.getKind()).to.equal('tiger');
		expect(tiger.animalKind).to.equal('tiger');

		expect(elephant.doCall()).to.equal('braaamp!!!');
		expect(elephant.getKind()).to.equal('elephant');
		expect(elephant.animalKind).to.equal('elephant');

		var car = Auto({ autoKind: 'car', hornSound: 'honk' });
		var truck = Auto({ autoKind: 'truck', hornSound: 'braaamp' });

		expect(car.tootHorn()).to.equal('honk!!!');
		expect(car.autoKind).to.equal('car');

		expect(truck.tootHorn()).to.equal('braaamp!!!');
		expect(truck.autoKind).to.equal('truck');

		expect(car.brake).to.equal(undefined);

		Auto.addMethod('brake', function brake(){ return 'stop!'; });

		expect(car.brake).to.be.a('function');
		expect(car.brake).to.equal(truck.brake);
		expect(car.brake()).to.equal('stop!');
	});

	it('klass private members', function() {

		var Auto = shimlibKlass.klass({
				autoKind: undefined,
				hornSound: undefined,
				tootHorn: function () {
					return this.hornSound + '!!!';
				},
			}
		);

		Auto.private({ secret: 'shhh' });

		var car = Auto({ autoKind: 'car', hornSound: 'honk' });
		var truck = Auto({ autoKind: 'truck', hornSound: 'braaamp' });

		expect(car.getSecret).to.equal(undefined);
		expect(truck.getSecret).to.equal(undefined);

		Auto.privateMethod('getSecret', function(_private){
			return _private.secret;
		});

		expect(Auto.secret).to.equal(undefined);
		expect(car.secret).to.equal(undefined);
		expect(truck.secret).to.equal(undefined);
		expect(Auto._private).to.equal(undefined);
		expect(car._private).to.equal(undefined);
		expect(truck._private).to.equal(undefined);
		expect(car.getSecret()).to.equal('shhh');
		expect(truck.getSecret()).to.equal('shhh');
	});

	it('calls initialize', function() {
		var count = 0;

		var Machine = shimlibKlass.klass({
			machineKind: undefined,
			powerSource: undefined,

			getSource: function() {
				return powerSource;
			},

			initialize: function(o) {
				this.count = count++;
			}
		});

		var lathe = Machine({ machineKind: 'lathe' });
		var bandSaw = Machine({ machineKind: 'band saw' });

		expect(lathe.count).to.equal(0);
		expect(bandSaw.count).to.equal(1);
	});

	it('extend', function(){
		var Machine = shimlibKlass.klass({
			machineKind: undefined,
			isMachine: true,
		});

		Machine.static({ likesPower: true });

		var NuclearMachine = Machine.extend({
			machineKind: 'nuclear',
			isNuclear: true,
			modelNumber: undefined,
			meltdown: function() {
				return 'OH NOOOOOO';
			}
		});

		var nukeMachine = NuclearMachine({ modelNumber: '1234' });

		expect(Machine.likesPower).to.equal(true);
		expect(NuclearMachine.likesPower).to.equal(true);

		expect(nukeMachine.isMachine).to.equal(true);
		expect(nukeMachine.modelNumber).to.equal('1234');
		expect(nukeMachine.meltdown).to.be.a('function');
		expect(nukeMachine.machineKind).to.equal('nuclear');

		var plainMachine = Machine({ machineKind: 'plain' });

		expect(plainMachine.machineKind).to.equal('plain');
		expect(plainMachine.isMachine).to.equal(true);
		expect(plainMachine.modelNumber).to.equal(undefined);
		expect(plainMachine.meltdown).to.equal(undefined);
	});

	it('static', function() {
		var Fruit = shimlibKlass.klass({
			hasCore: undefined,
			isSweet: true,
			initialize: function() {
				Fruit.addFruitInstance(this);
			}
		});

		Fruit.static({
			allFruits: [],

			addFruitInstance: function(instance) {
				Fruit.allFruits.push(instance);
			}
		});

		var apple = Fruit({ hasCore: true });
		var raspberry = Fruit({ hasCore: false });
		var peach = Fruit({ hasCore: true });

		expect(Fruit.addFruitInstance).to.be.a('function');
		expect(Fruit.allFruits).to.deep.equal([ apple, raspberry, peach ]);
	});

	it('works when accidentally called with new', function() {
		var s = '';

		var Wine = shimlibKlass.klass({
			initialize: function() {
				s += this.varietal;
			},
			varietal: undefined,
			swirl: function() {
				return "swish swish!";
			}
		});

		var cab = Wine({ varietal: "Cabernet Sauvignon" });
		expect(cab.varietal).to.equal('Cabernet Sauvignon');
		expect(cab.swirl()).to.equal('swish swish!');

		var oopsShiraz = new Wine({ varietal: 'Shiraz' });
		expect(oopsShiraz.varietal).to.equal('Shiraz');
		expect(oopsShiraz.swirl()).to.equal('swish swish!');

		expect(s).to.equal('Cabernet SauvignonShiraz');
	});
});
