
var cb = require('./cb')
var promise = require('./promise')

/**
 * Dispatch to what looks like the correct API
 */

module.exports = function(obj, pred){
	return pred.length > 2
		? cb(obj, pred) 
		: promise(obj, pred)
}