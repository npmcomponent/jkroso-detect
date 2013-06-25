
var chai = require('./chai')
  , Result = require('result')
  , series = require('../series')
  , async = require('../async')
  , detect = require('..')

describe('detect', function(){
	it('should return the first item that passes the test', function(){
		detect([1,2,3], function(item){
			return item == 2
		}).should.equal(2)
	})

	it('should return undefined otherwise', function(){
		should.not.exist(detect([1,2,3], function(item){
			return item == 4
		}))
	})
})

describe('async', function(){
	it('should resolve to the first passing item', function(done){
		async([1,2,3], function(item){
			return delay(item == 2)
		}).then(function(item){
			item.should.equal(2)
		}).node(done)
	})

	it('should reject if no input items available', function(done){
		async([], function(){}).then(null, function(reason){
			reason.should.be.an.instanceOf(Error)
			done()
		})
	})

	it('should reject if nothing passes', function(done){
		async([1,2,3], function(){ 
			return delay(false) 
		}).then(null, function(reason){
			reason.should.be.an.instanceOf(Error)
			done()
		})
	})

	it('should handle immediate resolution', function(done){
		async([1,2,3], function(item){
			if (item == 2) return Result.wrap(true)
			return delay(false)
		}).then(function(val){
			val.should.equal(2)
		}).node(done)
	})


	describe('error handling', function(){
		it('should catch sync errors', function(done){
			var error = new Error(this.test.title)
			async([1,2,3], function(item){
				throw error
			}).then(null, function(e){
				e.should.equal(error)
				done()
			})
		})

		it('should catch async errors', function(done){
			var error = new Error(this.test.title)
			async([1,2,3], function(item){
				if (item == 2) return delay(error)
				return delay(false)
			}).then(null, function(e){
				e.should.equal(error)
				done()
			})
		})
	})
})

describe('series', function(){
	it('should return the first passing item by position', function(done){
		series([1,2,3], function(item, i){
			return delay(item > 1)
		}).then(function(item){
			item.should.equal(2)
		}).node(done)
	})

	describe('error handling', function(){
		it('should catch sync errors', function(done){
			var error = new Error(this.test.title)
			series([1,2,3], function(item){
				throw error
			}).then(null, function(e){
				e.should.equal(error)
				done()
			})
		})

		it('should catch async errors', function(done){
			var error = new Error(this.test.title)
			series([1,2,3], function(item){
				if (item == 2) return delay(error)
				return delay(false)
			}).then(null, function(e){
				e.should.equal(error)
				done()
			})
		})
	})
})
