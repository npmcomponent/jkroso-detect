
var Promise = require('laissez-faire')

/**
 * find the first item that passes the `pred` test
 * 
 * @param {Array} array
 * @param {Function} pred (item, callback)
 * @return {Promise} for first passing value
 */

module.exports = function(array, pred){
	var i = array.length
	var pending = i
	var p = new Promise
	if (!i) fail(p)
	else do block(array[--i]); while(i)
	function block(item){
		pred(item, function(yes){
			if (yes) p.fulfill(item), i = 0
			else if (--pending < 1) fail(p)
		})
	}
	return p
}

function fail(promise){
	promise.reject(new Error('none passed'))
}
