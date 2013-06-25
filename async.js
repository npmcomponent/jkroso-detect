
var decorate = require('resultify')
var when = require('when/read')

module.exports = decorate(parallelDetect)

/**
 * find the first item that passes the `pred` test
 * 
 * @param {Array} array
 * @param {Function} pred (value, key) -> Boolean
 * @param {Any} [ctx]
 * @param {Function} cb
 */

function parallelDetect(array, pred, ctx, cb){
	if (cb === undefined) cb = ctx, ctx = null
	var len = array.length
	if (!len) return cb(new Error('can\'t detect within an empty array'))
	var pending = len
	var i = 0
	do block(array[i]); while(++i < len)
	function block(item){
		when(pred.call(ctx, item, i), function(yes){
			if (yes) return cb(null, item), len = 0
			if (--pending === 0) cb(new Error('no items detected'))
		}, cb)
	}
}