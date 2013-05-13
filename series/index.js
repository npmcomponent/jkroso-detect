
var cb = require('./cb')
var promise = require('./promise')

/**
 * dispatch by guessing the expected API
 * 
 * @param {Array} obj
 * @param {Function} pred
 * @param {Any} [ctx]
 * @return {Promise}
 */

module.exports = function(obj, pred, ctx){
	return pred.length > 2
		? cb(obj, pred, ctx)
		: promise(obj, pred, ctx)
}