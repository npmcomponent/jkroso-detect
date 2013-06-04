
var Promise = require('laissez-faire/full')
var when = require('when/read')

/**
 * find the first item in `array` by position that doesn't
 * fail the `pred` test
 * 
 * @param {Array} array
 * @param {Function} pred (value, key) -> Boolean
 * @param {Any} [context]
 * @return {Promise} for first passing value
 */

module.exports = function(array, pred, ctx){
	var i = 0
	var pending = array.length
	var promise = new Promise
	function next(yes){
		if (yes) promise.write(array[i - 1])
		else if (i == pending) fail()
		else when(pred.call(ctx, array[i], i++), next, fail)
	}
	function fail(e){
		promise.error(e || new Error('none of ' + pending + ' detected'))
	}
	next(false)
	return promise
}
