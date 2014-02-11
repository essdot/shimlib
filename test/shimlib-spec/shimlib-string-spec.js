describe('shimlib string', function() {
	var shimlibString = require('../../app/shimlib-string');

	it('strip', function(){
		var s = "  abc  ";
		var tab = String.fromCharCode(9);

		expect(shimlibString.strip('  123  ')).to.equal('123');
		expect(shimlibString.strip('123  ')).to.equal('123');
		expect(shimlibString.strip('  123')).to.equal('123');
		expect(shimlibString.strip(tab + ' ' + tab + '123 ' + tab + ' ')).to.equal('123');
		expect(shimlibString.strip('    ')).to.equal('');
		expect(shimlibString.strip(tab + ' ' + tab)).to.equal('');
		expect(shimlibString.strip(undefined)).to.equal(undefined);
		expect(shimlibString.strip(null)).to.equal(undefined);
		expect(shimlibString.strip({})).to.equal(undefined);
	});
});