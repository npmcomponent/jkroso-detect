
var should = require('chai').should()
  , detect = require('..')
  , promise = require('laissez-faire')
  , series = require('../series')
  , async = require('../async')

function delay(err, val){
	var args = arguments
	return promise(function(fulfill, reject){
		setTimeout(function(){
			if (args.length > 1) fulfill(val)
			else reject(err)
		}, Math.round(Math.random() * 10))
	})
}

describe('detect', function () {
	it('should return the first item that passes the test', function () {
		detect([1,2,3], function(item){
			return item == 2
		}).should.equal(2)
	})

	it('should return undefined otherwise', function () {
		should.not.exist(detect([1,2,3], function(item){
			return item == 4
		}))
	})
})

describe('async', function () {
	it('should resolve to the first passing item', function (done) {
		async([1,2,3], function(item){
			return delay(null, item == 2)
		}).then(function(item){
			item.should.equal(2)
		}).node(done)
	})

	it('should reject if no input items available', function (done) {
		async([], function(){}).then(null, function(reason){
			reason.should.be.an.instanceOf(Error)
		}).node(done)
	})

	it('should reject if nothing passes', function (done) {
		async([1,2,3], function(){ 
			return delay(null, false) 
		}).then(null, function(reason){
			reason.should.be.an.instanceOf(Error)
		}).node(done)
	})

	it('should handle immediate resolution', function (done) {
		async([1,2,3], function(item){
			if (item == 2) return promise().resolve(true)
			return delay(null, false)
		}).then(function(val){
			val.should.equal(2)
		}).node(done)
	})

	it('should propagate rejection', function (done) {
		async([1,2,3], function(item){
			if (item == 2) return delay(2)
			return delay(null, false)
		}).then(null, function(val){
			val.should.equal(2)
			done()
		})
	})
})

describe('series', function () {
	it('should return the first passing item by position', function (done) {
		series([1,2,3], function(item, i){
			return delay(null, item > 1)
		}).then(function(item){
			item.should.equal(2)
		}).node(done)
	})
})
