describe('shimlib number', function() {
	shimlibNumber = require('shimlib-number');
	
	it('to fixed', function(){
		expect(shimlibNumber.toFixed(75, 0)).to.equal('75');
		expect(shimlibNumber.toFixed(75, 1)).to.equal('75.0');
		expect(shimlibNumber.toFixed(75, 2)).to.equal('75.00');
		expect(shimlibNumber.toFixed(-75, 2)).to.equal('-75.00');
		expect(shimlibNumber.toFixed(75.105, 2)).to.equal('75.10');
		expect(shimlibNumber.toFixed(-75.106, 2)).to.equal('-75.10');
		expect(shimlibNumber.toFixed(2.00193, 3)).to.equal('2.001');
		expect(shimlibNumber.toFixed(-1, 3)).to.equal('-1.000');
		expect(shimlibNumber.toFixed(-1.6789, 3)).to.equal('-1.678');
		expect(shimlibNumber.toFixed(1.111111111111111, 6)).to.equal('1.111111');
		expect(shimlibNumber.toFixed(0, 0)).to.equal('0');
		expect(shimlibNumber.toFixed(0, 1)).to.equal('0.0');
		expect(shimlibNumber.toFixed(0, 2)).to.equal('0.00');
		expect(shimlibNumber.toFixed(-0, 2)).to.equal('0.00');
		expect(shimlibNumber.toFixed(0, 6)).to.equal('0.000000');
		expect(shimlibNumber.toFixed(683039.112556, 4)).to.equal('683039.1125');
		expect(shimlibNumber.toFixed(-683039.112556, 4)).to.equal('-683039.1125');
		expect(shimlibNumber.toFixed(1234.1234, 4)).to.equal('1234.1234');
		expect(shimlibNumber.toFixed(6789.67899, 4)).to.equal('6789.6789');
		expect(shimlibNumber.toFixed(6789.90909090, 6)).to.equal('6789.909090');
		expect(shimlibNumber.toFixed(-6789.90909090, 6)).to.equal('-6789.909090');
		expect(shimlibNumber.toFixed(0.5, 1)).to.equal('0.5');
		expect(shimlibNumber.toFixed(-0.5, 1)).to.equal('-0.5');
		expect(shimlibNumber.toFixed(0.5, 6)).to.equal('0.500000');
		expect(shimlibNumber.toFixed(-0.5, 6)).to.equal('-0.500000');
		expect(shimlibNumber.toFixed((2/3), 6)).to.equal('0.666666');
		expect(shimlibNumber.toFixed(-(2/3), 2)).to.equal('-0.66');
		expect(shimlibNumber.toFixed((1/4), 6)).to.equal('0.250000');
		expect(shimlibNumber.toFixed((1/8), 6)).to.equal('0.125000');
	});
});