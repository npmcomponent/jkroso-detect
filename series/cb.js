
var Promise = require('laissez-faire/full')

/**
 * find the first item in `array` by position that doesn't
 * fail the `pred` test
 * 
 * @param {Array} array
 * @param {Function} pred (value, key, callback)
 * @param {Any} [context]
 * @return {Promise} for first passing value
 */

module.exports = function(array, pred, ctx){
	var i = 0
	var pending = array.length
	var p = new Promise
	function next(yes){
		if (yes) p.fulfill(array[i - 1])
		else if (i == pending) p.reject(new Error('none passed'))
		else pred.call(ctx, array[i], i++, next)
	}
	next(false)
	return p
}
