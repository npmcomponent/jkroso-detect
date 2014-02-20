
// commented out by npm-component: var lift = require('lift-result/cps')
var read = require('jkroso-result').read

/**
 * find the first item in `array` by position that passes the `pred` test
 *
 * @param {Array} array
 * @param {Function} pred (value, key) -> Boolean
 * @param {Any} [context]
 * @return {Result}
 */

module.exports = lift(function(array, pred, ctx, cb){
  if (cb === undefined) cb = ctx, ctx = null
  var pending = array.length
  var i = 0
  function next(yes){
    if (yes) return cb(null, array[i - 1])
    if (i == pending) return cb(new Error('none of ' + pending + ' detected'))
    try { yes = pred.call(ctx, array[i], i++) }
    catch (e) { return cb(e) }
    read(yes, next, cb)
  }
  next(false)
})