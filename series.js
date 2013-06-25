
var decorate = require('resultify')
var when = require('when/read')

/**
 * find the first item in `array` by position that doesn't
 * fail the `pred` test
 * 
 * @param {Array} array
 * @param {Function} pred (value, key) -> Boolean
 * @param {Any} [context]
 * @param {Function} cb
 */

module.exports = decorate(detectSeries) 
module.exports.plain = detectSeries

function detectSeries(array, pred, ctx, cb){
	if (cb === undefined) cb = ctx, ctx = null
	var pending = array.length
	var i = 0
	function next(yes){
		if (yes) return cb(null, array[i - 1])
		if (i == pending) return cb(new Error('none of ' + pending + ' detected'))
		try { yes = pred.call(ctx, array[i], i++) }
		catch (e) { return cb(e) }
		when(yes, next, cb)
	}
	next(false)
}
