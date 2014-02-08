(function shimlibQsModule() {
	"use strict";

	var _hasOwn = Object.prototype.hasOwnProperty;
	var _undefined = void 0;

	var shimlibIs = require('shimlib-is');
	var shimlibObject = require('shimlib-object');

	function shimlibToQueryString(o) {
		if (!o) { return; }

		function stringFromPair(key, val) {
			var returnVal = encodeURIComponent(key);

			if (val !== '' && val !== _undefined && val !== null) {
				returnVal += "=" + encodeURIComponent(val);
			}

			return returnVal;
		}

		function stringForKey(key) {
			var val = o[key];

			if (shimlibIs.isArray(val)) {
				return val.map(function(valval) {
					return stringFromPair(key, valval);
				}).join('&');
			} else {
				return stringFromPair(key, val);
			}
		}

		var keys = shimlibObject.keys(o);

		return keys.map(stringForKey).join('&');
	}

	function shimlibFromQueryString(qs) {
		// segment is 'value=key'
		function pairFromSegment(segment) {
			var arr = segment.split('=');
			var pair = {
				key: decodeURIComponent(arr.shift()),
				val: arr.length > 1 ? arr.join('=') : arr[0]
			};

			pair.val = normalizeValue(pair.val);

			return pair;
		}

		function normalizeValue(val) {
			if (val === _undefined) { return ''; }

			val = decodeURIComponent(val);
			
			var valAsNumber = val - 0;

			if (!isNaN(valAsNumber) && val !== '') {
				val = valAsNumber;
			}

			return val;
		}

		function addPairToObject(pair, obj) {
			if (_hasOwn.call(obj, pair.key)) {
				if (!shimlibIs.isArray(obj[pair.key])) {
					obj[pair.key] = [ obj[pair.key] ];
				}

				obj[pair.key].push(pair.val);
			} else {
				obj[pair.key] = pair.val;
			}
		}

		if (!qs) { return; }
		var match = qs.match(/([^?#]*)(#.*)?$/);
		if (!match) return { };

		var segments = match[1].split('&');

		var newObj = {};

		for (var i = 0; i < segments.length; i++) {
			var pair = pairFromSegment(segments[i]);

			addPairToObject(pair, newObj);
		}

		return newObj;
	}

	var shimlibQs = {
		toQueryString: shimlibToQueryString,
		fromQueryString: shimlibFromQueryString
    };

    module.exports = shimlibQs;
})();