
var should = require('chai').should()
  , detect = require('..')
  , sync = require('../sync')
  , series = require('../series')

function delay(fn){
	var args = Array.prototype.slice.call(arguments, 1)
	setTimeout(function () {
		fn.apply(null, args)
	}, Math.round(Math.random() * 10))
}

describe('detect', function () {
	it('should work', function (done) {
		detect([1,2,3], function(item, cb){
			delay(cb, item == 2)
		}).then(function(item){
			item.should.equal(2)
		}).nead(done)
	})

	it('should reject if no input items available', function (done) {
		detect([], function(){}).then(null, function(reason){
			reason.should.be.an.instanceOf(Error)
		}).nead(done)
	})

	it('should reject if nothing passes', function (done) {
		detect([1,2,3], function(_, cb){ 
			delay(cb, false) 
		}).then(null, function(reason){
			reason.should.be.an.instanceOf(Error)
		}).nead(done)
	})
})

describe('series', function () {
	it('should return the first passing item by position', function (done) {
		series([1,2,3], function(item, cb){
			delay(cb, true)
		}).then(function(item){
			item.should.equal(1)
		}).nead(done)
	})
})

describe('sync', function () {
	it('should work', function () {
		sync([1,2,3], function(item){
			return item == 2
		}).should.equal(2)
	})
})
