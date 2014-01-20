
/**
 * find the first item that passes the `pred` test
 * 
 * @param {Array} array
 * @param {Function} pred (item)
 * @param {Any} [ctx]
 * @return {Any} the first passing value
 */

module.exports = function(array, pred, ctx){
  for (var i = 0, len = array.length; i < len; i++) {
    if (pred.call(ctx, array[i])) return array[i]
  }
}
