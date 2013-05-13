
var Promise = require('laissez-faire/full')
  , when = require('when/read')

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
		else if (i == pending) fail()
		else when(pred.call(ctx, array[i], i++), next, fail)
	}
	function fail(e){
		p.reject(e || new Error('0 of '+pending+' items passed the predicate'))
	}
	next(false)
	return p
}
