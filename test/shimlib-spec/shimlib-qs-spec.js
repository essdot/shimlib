describe('shimlib query string', function(){
	shimlibQs = require('../../app/shimlib-qs');

	it('handle number values', function() {
		var qs = 'decimal=1.7903&negativeDecimal=-0.235&zero=0&integer=12&negativeInteger=-28';

		var obj = {
			decimal: 1.7903,
			negativeDecimal: -0.235,
			zero: 0,
			integer: 12,
			negativeInteger: -28
		};

		expect(shimlibQs.fromQueryString(qs)).to.deep.equal(obj);
		expect(shimlibQs.toQueryString(obj)).to.deep.equal(qs);
	});

	it('handle encoded strings', function() {
		var qs = 'crazy%3Aname=y&rappers=biggie%20%26%20pac&valWithEqSigns=a%3Db%3Dc&abc=abc';
		var obj = {
			'crazy:name': 'y',
			rappers: 'biggie & pac',
			valWithEqSigns: 'a=b=c',
			abc: 'abc'
		};

		expect(shimlibQs.fromQueryString(qs)).to.deep.equal(obj);
		expect(shimlibQs.toQueryString(obj)).to.deep.equal(qs);
	});

	it('handle array values', function() {
		var qs = 'strings=dd&strings=ff&strings=ty&numbers=1&numbers=2&numbers=3&numbers=4&empty&empty&mixed&mixed=1&mixed=hello';
		var obj = {
			strings: [ 'dd', 'ff', 'ty' ],
			numbers: [ 1, 2, 3, 4 ],
			empty: [ '', '' ],
			mixed: ['', 1, 'hello']
		};

		expect(shimlibQs.fromQueryString(qs)).to.deep.equal(obj);
		expect(shimlibQs.toQueryString(obj)).to.deep.equal(qs);
	});

	it('to query string', function() {
		var qs = 'empty&empty2&negOne=-1&zero=0&hoobar=8&glenk=77&gary=abc&brelt=dd&brelt=ff&brelt=ty&laild=1&laild=2&laild=3&laild=4&rappers=biggie%20%26%20pac&valWithEqSigns=a%3Db%3Dc&crazy%3Aname=y';
		var obj = {
			empty: '',
			empty2: '',
			negOne: -1,
			zero: 0,
			hoobar: 8,
			glenk: 77,
			gary: 'abc',
			brelt: ['dd', 'ff', 'ty'],
			laild: [1, 2, 3, 4],
			rappers: 'biggie & pac',
			valWithEqSigns: 'a=b=c',
			'crazy:name': 'y'
		};

		expect(shimlibQs.toQueryString(obj)).to.equal(qs);
	});

	it('from query string', function() {
		var qs = 'empty&empty2=&negOne=-1&zero=0&hoobar=8&glenk=77&gary=abc&brelt=dd&brelt=ff&brelt=ty&laild=1&laild=2&laild=3&laild=4&rappers=biggie%20%26%20pac&valWithEqSigns=a%3Db%3Dc&crazy%3Aname=y';
		var obj = {
			empty: '',
			empty2: '',
			negOne: -1,
			zero: 0,
			hoobar: 8,
			glenk: 77,
			gary: 'abc',
			brelt: ['dd', 'ff', 'ty'],
			laild: [1, 2, 3, 4],
			rappers: 'biggie & pac',
			valWithEqSigns: 'a=b=c',
			'crazy:name': 'y'
		};

		expect(shimlibQs.fromQueryString(qs)).to.deep.equal(obj);
	});

	it('query string from url', function() {
		var url = 'http://www.example.com?section=blog&id=45#comments';
		var urlObj = { section: 'blog', id: 45 };

		expect(shimlibQs.fromQueryString(url)).to.deep.equal(urlObj);
	});
});