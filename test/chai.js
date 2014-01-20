
var chai = require('chai')
var Result = require('result')

global.should = chai.should()
global.expect = chai.expect
global.assert = chai.assert
// chai.use(require('chai-spies'))

global.delay = function(value){
  var result = new Result
  setTimeout(function(){
    if (value instanceof Error) result.error(value)
    else result.write(value)
  }, Math.random() * 10)
  return result
}

chai.Assertion.includeStack = true

module.exports = chai