
var Promise = require('laissez-faire/full')
  , when = require('when/read')

/**
 * find the first item that passes the `pred` test
 * 
 * @param {Array} array
 * @param {Function} pred (value, key) -> Promise Boolean
 * @param {Any} [ctx]
 * @return {Promise} for first passing value
 */

module.exports = function(array, pred, ctx){
	var len = array.length
	var i = 0
	var pending = len
	var p = new Promise
	if (!len) fail()
	else do block(array[i]); while(++i < len)
	function block(item){
		when(pred.call(ctx, item, i), function(yes){
			if (yes) p.fulfill(item), i = 1
			else if (--pending < 1) fail()
		}, fail)
	}
	function fail(e){
		p.reject(e || new Error('0 of '+len+' items passed'))
	}
	return p
}
