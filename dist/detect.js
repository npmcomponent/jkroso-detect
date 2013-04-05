!function (context, definition) {
	if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
		module.exports = definition()
	} else if (typeof define === 'function' && typeof define.amd  === 'object') {
		define(definition)
	} else {
		context['detect'] = definition()
	}
}(this, function () {
	/**	
	 * Require the given path.	
	 *	
	 * @param {String} path   Full path to the required file	
	 * @param {String} parent The file which this call originated from	
	 * @return {Object} module.exports	
	 */	
		
	function require (path, parent){	
		parent || (parent = '/')	
		// Determine the correct path	
		var fullpath = resolve(parent, path)	
		  , module = modules[fullpath]	
		
		if (module == null) throw Error('failed to require '+path+' from '+(parent || 'root'))	
		
		// It hasn't been loaded before	
		if (typeof module === 'string') {	
			var code = module	
			module = {	
				src: code,	
				exports: {}	
			}	
			modules[fullpath] = module	
			Function(	
				'module',	
				'exports',	
				'require',	
				// The source allows the browser to present this module as if it was a normal file	
				code+'\n//@ sourceURL='+encodeURI(fullpath)	
			).call(module.exports, module, module.exports,	
				// Relative require function	
				function (rp) {	
					if (rp[0] === '.') rp = join(dirname(fullpath), rp)	
					return require(rp, fullpath)	
				}	
			)	
		}	
		return module.exports	
	}	
		
	/**	
	 * Figure out what the full path to the module is	
	 *	
	 * @param {String} base, the current directory	
	 * @param {String} path, what was inside the call to require	
	 * @return {String}	
	 * @api private	
	 */	
		
	function resolve (base, path) {	
		if (path.match(/^\/|(?:[a-zA-Z]+:)/)) {	
			return modules[path] && path	
				|| modules[path+'.js'] && path+'.js'	
				|| modules[path+'.json'] && path+'.json'	
				|| modules[path+'index.js'] && path+'index.js'	
				|| modules[path+'/index.js'] && path+'/index.js'	
		}	
		
		while (true) {	
			var res = node_modules(base, path, modules)	
			if (res != null) return res	
			if (base === '/') break	
			base = dirname(base)	
		}	
	}	
		
	function dirname (path) {	
		if (path[path.length - 1] === '/') path = path.slice(0, -1)	
		return path.split('/').slice(0,-1).join('/') || '/'	
	}	
		
	function normalize (path) {	
		var isAbsolute = path[0] === '/'	
		  , res = []	
		path = path.split('/')	
		
		for (var i = 0, len = path.length; i < len; i++) {	
			var seg = path[i]	
			if (seg === '..') res.pop()	
			else if (seg && seg !== '.') res.push(seg)	
		}	
		
		return (isAbsolute ? '/' : '') + res.join('/')	
	}	
		
	function join () {	
		return normalize(slice(arguments).filter(function(p) {	
			return p	
		}).join('/'))	
	}	
		
	function slice (args) {	
		return Array.prototype.slice.call(args)	
	}	
	
	function node_modules (dir, name, hash) {
		var match = variants(dir, name).filter(function (p) {
			return p in hash
		})
	
		if (match.length) {
			if (match.length > 1) console.warn('%s -> %s has several matches', dir, name)
			return match[0]
		}
	
		// core modules
		if (dir === '/' && hash['/node_modules/'+name+'.js']) {
			return '/node_modules/'+name+'.js'
		}
	}
	
	function variants(dir, path) {
		// Is it a full path already
		if (path.match(/\.js(?:on)?$/)) {
			path = [path]
		}
		// A directory
		else if (path.match(/\/$/)) {
			path = [
				path+'index.js',
				path+'index.json',
				path+'package.json'
			]
		}
		// could be a directory or a file
		else {
			path = [
				path+'.js',
				path+'.json',
				path+'/index.js',
				path+'/index.json',
				path+'/package.json'
			]
		}
	
		return path.map(function (name) {
			return join(dir, 'node_modules', name)
		})
	}
	var modules = {
		"/index.js": "\nvar Promise = require('laissez-faire')\n\n/**\n * find the first item that passes the `pred` test\n * \n * @param {Array} array\n * @param {Function} pred (item, callback)\n * @return {Promise} for first passing value\n */\n\nmodule.exports = function(array, pred){\n\tvar i = array.length\n\tvar pending = i\n\tvar p = new Promise\n\tif (!i) fail(p)\n\telse do block(array[--i]); while(i)\n\tfunction block(item){\n\t\tpred(item, function(yes){\n\t\t\tif (yes) p.fulfill(item), i = 0\n\t\t\telse if (--pending < 1) fail(p)\n\t\t})\n\t}\n\treturn p\n}\n\nfunction fail(promise){\n\tpromise.reject(new Error('none passed'))\n}\n",
		"/node_modules/laissez-faire/index.js": "\r\n/**\r\n * Promise class\r\n *\r\n *   var promise = new Promise\r\n *   fs.readFile('/files.js', function(err, src){\r\n *     if (err) promise.reject(err)\r\n *     else promise.fulfill(src)\r\n *   })\r\n *   return promise\r\n */\r\n\r\nfunction Promise () {\r\n\tthis.i = 0\r\n}\r\n\r\n// set default values\r\nPromise.prototype.i = 0\r\nPromise.prototype.state = 'pending'\r\n\r\n/**\r\n * Create a promise for a transformation of the value\r\n * of `this` promise\r\n *\r\n *   promise.then(\r\n *     function(value){\r\n *       return value\r\n *     },\r\n *     function(error){\r\n *       return correction\r\n *     }\r\n *   )\r\n * \r\n * @param  {Function} sh\r\n * @param  {Function} fh\r\n * @return {Promise}\r\n */\r\n\r\nPromise.prototype.then = function(sh, fh) {\r\n\tswitch (this.state) {\r\n\t\tcase 'pending':\r\n\t\t\tvar thenPromise = this[this.i++] = new Promise\r\n\t\t\tthenPromise._sh = sh\r\n\t\t\tthenPromise._fh = fh\r\n\t\t\treturn thenPromise\r\n\t\tcase 'fulfilled':\r\n\t\t\treturn sh \r\n\t\t\t\t? run(sh, this.value) \r\n\t\t\t\t: newFulfilled(this.value)\r\n\t\tcase 'rejected':\r\n\t\t\tif (fh) {\r\n\t\t\t\tPromise.onCatch && Promise.onCatch(this)\r\n\t\t\t\treturn run(fh, this.reason)\r\n\t\t\t}\r\n\t\t\treturn newRejected(this.reason)\r\n\t}\r\n}\r\n\r\n/**\r\n * Process the value safely and ensure that what is returned is \r\n * represented via a new Laissez promise.\r\n * \r\n * @param {Function} fn the handler to apply\r\n * @param {Any} value\r\n * @api private\r\n */\r\n\r\nfunction run (fn, value) {\r\n\ttry { fn = fn(value) } \r\n\tcatch (e) { \r\n\t\tfn = newRejected(e)\r\n\t\tPromise.onError && Promise.onError(fn, e)\r\n\t\treturn fn\r\n\t}\r\n\r\n\t// No need to create a new promise if we already have one\r\n\tif (fn && typeof fn.then === 'function') {\r\n\t\tif (fn instanceof Promise) return fn\r\n\t\t// Convert to a trusted Promise\r\n\t\tvalue = new Promise\r\n\t\tfn.then(\r\n\t\t\tfunction (v) {value.resolve(v) }, \r\n\t\t\tfunction (e) {value.reject(e) }\r\n\t\t)\r\n\t\treturn value\r\n\t}\r\n\treturn newFulfilled(fn)\r\n}\r\n\r\n/**\r\n * Read the value of a promise. If it has a value the\r\n * appropriate handler will be called immediatly otherwise\r\n * the handler is queued \r\n * \r\n * @param  {Function} sh\r\n * @param  {Function} fh\r\n * @return {this}\r\n */\r\n\r\nPromise.prototype.read = function (sh, fh) {\r\n\tswitch (this.state) {\r\n\t\tcase 'pending':\r\n\t\t\t// create a dummy promise\r\n\t\t\tthis[this.i++] = {\r\n\t\t\t\t// Handlers are bound to the assignment properties since these aren't run \r\n\t\t\t\t// inside a try catch. Having no handlers is fine, the values will just \r\n\t\t\t\t// pass straight through to the resolvers.\r\n\t\t\t\tresolve: sh || noop,\r\n\t\t\t\treject: fh || thrower\r\n\t\t\t}\r\n\t\t\tbreak\r\n\t\tcase 'fulfilled':\r\n\t\t\tsh && sh(this.value)\r\n\t\t\tbreak\r\n\t\tcase 'rejected':\r\n\t\t\tPromise.onCatch && Promise.onCatch(this)\r\n\t\t\tif (!fh) throw this.reason\r\n\t\t\tfh(this.reason)\r\n\t}\r\n\treturn this\r\n}\r\n\r\nfunction thrower (e) {throw e}\r\nfunction noop () {}\r\n\r\n/**\r\n * Give the promise it's value\r\n *\r\n * @param  {Any} [value]\r\n * @return {this}\r\n */\r\n\r\nPromise.prototype.fulfill = function (value) {\r\n\tif (this.state === 'pending') {\r\n\t\t// Change the state\r\n\t\tthis.value = value\r\n\t\tthis.state = 'fulfilled'\r\n\t\t// Propagate the value to any queued promises.\r\n\t\tvar child, i = 0\r\n\t\twhile (child = this[i++]) {\r\n\t\t\tif (child._sh) propagate(child, child._sh, value)\r\n\t\t\telse child.resolve(value)\r\n\t\t}\r\n\t}\r\n\treturn this\r\n}\r\n\r\n/**\r\n * Break the promise\r\n * \r\n * @param  {Any} [e] the reason for rejection\r\n * @return {Self}\r\n */\r\n\r\nPromise.prototype.reject = function (e) {\r\n\tif (this.state === 'pending') {\r\n\t\tthis.state = 'rejected'\r\n\t\tthis.reason = e\r\n\t\r\n\t\tvar i = 0 , child = this[0]\r\n\t\tif (child) {\r\n\t\t\tdo {\r\n\t\t\t\tif (child._fh) propagate(child, child._fh, e)\r\n\t\t\t\telse child.reject(e)\r\n\t\t\t} while (child = this[++i])\r\n\t\t}\r\n\t\telse {\r\n\t\t\tPromise.onError && Promise.onError(this, e)\r\n\t\t}\r\n\t}\r\n\treturn this\r\n}\r\n\r\n/**\r\n * Handle the processing of a promise and resolve or reject it based on the results\r\n * \r\n * @param {Promise} promise The promise we are computing the value for\r\n * @param {Function} fn either the success or error handler\r\n * @param {Any} value The input\r\n * @api private\r\n */\r\n\r\nfunction propagate (promise, fn, value) {\r\n\ttry { value = fn(value) } \r\n\tcatch (e) { return promise.reject(e) }\r\n\r\n\tif (value && typeof value.then === 'function') {\r\n\t\t// prefer .read() for speed\r\n\t\tvalue[value instanceof Promise ? 'read': 'then'](\r\n\t\t\tfunction (val) {promise.fulfill(val)}, \r\n\t\t\tfunction (err) {promise.reject(err) })\r\n\t} else {\r\n\t\tpromise.fulfill(value)\r\n\t}\r\n}\r\n\r\n/**\r\n * Convert to a Laissez-faire Promise\r\n *\r\n * @param {~Promise} promise, from another implementation\r\n * @return {Promise}\r\n * @api private\r\n */\r\n\r\nfunction extract (promise) {\r\n\tvar better = new Promise\r\n\tpromise.then(function (value) {\r\n\t\tbetter.resolve(value)\r\n\t}, function (reason) {\r\n\t\tbetter.reject(reason)\r\n\t})\r\n\treturn better\r\n}\r\n\r\n/**\r\n * Add an error handler\r\n * \r\n * @param  {Function} errback\r\n * @return {Promise}\r\n */\r\n\r\nPromise.prototype.otherwise = function (errback) {\r\n\treturn this.then(null, errback)\r\n}\r\n\r\n/**\r\n * Convenience function to use the same function \r\n * for both success and failure\r\n * \r\n * @param  {Function} callback\r\n * @return {Promise}\r\n */\r\n\r\nPromise.prototype.always = function (callback) {\r\n\treturn this.then(callback, callback)\r\n}\r\n\r\n/**\r\n * Allows the use of node style callbacks\r\n *\r\n *   promise.node(function(err, value) {\r\n *     if (err) return handleError(err)\r\n *     return value\r\n *   })\r\n *   \r\n * @param  {Function} callback [err, value]\r\n * @return {Promise}\r\n */\r\n\r\nPromise.prototype.node = function (callback) {\r\n\treturn this.then(\r\n\t\tfunction (val) { return callback(null, val) }, \r\n\t\tcallback\r\n\t)\r\n}\r\n\r\n/**\r\n * read using a node style function\r\n *\r\n *   promise.nead(function(err, value) {\r\n *     // handle error and value here\r\n *   })\r\n * \r\n * @param  {Function} callback [error, value]\r\n * @return {Self}\r\n */\r\n\r\nPromise.prototype.nead = function (callback) {\r\n\treturn this.read(\r\n\t\tfunction (val) {callback(null, val)}, \r\n\t\tcallback\r\n\t)\r\n}\r\n\r\n/**\r\n * Prevent `this` promise from delivering its value to\r\n * any readers\r\n * \r\n * @return {Self}\r\n */\r\n\r\nPromise.prototype.cancel = function () {\r\n\tthis.state = 'canceled'\r\n\twhile (this.i) delete this[--this.i]\r\n\treturn this\r\n}\r\n\r\n/**\r\n * Create a promise destined to resolve with a given value\r\n * but waiting for `this` to fulfill before doing so\r\n *\r\n *   return promise.then(function(value){\r\n *     // something side effect\r\n *   }).yeild(e)\r\n * \r\n * @param  {Any} value\r\n * @return {Promise}\r\n */\r\n\r\nPromise.prototype.yeild = function (value) {\r\n\treturn this.then(function () {return value})\r\n}\r\n\r\n/**\r\n * If the promise resolves to an array like object, apply the array\r\n * as arguments to the callbacks. \r\n *\r\n * @param {Function} sh\r\n * @param {Function} fh\r\n * @return {Promise}\r\n */\r\n\r\nPromise.prototype.spread = function (sh, fh) {\r\n\treturn this.then(function (vals) {\r\n\t\tif (!sh) return vals\r\n\t\tif (typeof vals.length === 'number') {\r\n\t\t\treturn sh.apply(null, vals)\r\n\t\t}\r\n\t\treturn sh(vals)\r\n\t}, function (reasons) {\r\n\t\tif (!fh) return reasons\r\n\t\tif (typeof reasons.length === 'number') {\r\n\t\t\treturn fh.apply(null, reasons)\r\n\t\t}\r\n\t\treturn fh(reasons)\r\n\t})\r\n}\r\n\r\n/**\r\n * Like then but it checks that a value is actually present before allowing\r\n * the success handler to be called. If no value is present then it will call\r\n * the rejection handler with a reason of \"does not exist\"\r\n * \r\n * @param {Function} sh\r\n * @param {Function} fh\r\n * @return {Promise}\r\n */\r\n\r\nPromise.prototype.exists = function (sh, fh) {\r\n\treturn this.then(exists).then(sh, fh)\r\n}\r\n\r\nfunction exists (val) {\r\n\tif (val == null) throw 'does not exist'\r\n\treturn val\r\n}\r\n\r\n/*\r\n * Create a pending promise \r\n * \r\n *   var promise = Promise.pending(function(promise){\r\n *     fs.readFile('/files.js', function(err, src){\r\n *       if (err) promise.reject(err)\r\n *       else promise.fulfill(src.toString())\r\n *     })\r\n *   })\r\n *   \r\n * @param {Function} [fn]\r\n * @return {Promise}\r\n */\r\n\r\nfunction newPending (fn) {\r\n\tvar promise = new Promise\r\n\tif (fn) fn.call(promise, promise)\r\n\treturn promise\r\n}\r\n\r\n/**\r\n * Helper to quickly create a rejected promise\r\n * \r\n * @param  {Error} [e]\r\n * @return {Promise}\r\n */\r\n\r\nfunction newRejected (e) {\r\n\tvar p = new Promise\r\n\tp.reason = e\r\n\tp.state = 'rejected'\r\n\treturn p\r\n}\r\n\r\n/**\r\n * Helper to quickly create a completed promise\r\n * \r\n * @param  {Any} [value]\r\n * @return {Promise}\r\n */\r\n\r\nfunction newFulfilled (value) {\r\n\tvar p = new Promise\r\n\tp.value = value\r\n\tp.state = 'fulfilled'\r\n\treturn p\r\n}\r\n\r\n// aliases\r\nPromise.prototype.throw = Promise.prototype.end = Promise.prototype.read\r\nPromise.prototype.write = Promise.prototype.resolve = Promise.prototype.fulfill\r\nPromise.prototype.break = Promise.prototype.reject\r\nPromise.prototype.catch = Promise.prototype.otherwise\r\n\r\n// exports\r\nmodule.exports = Promise\r\nPromise.fulfilled = newFulfilled\r\nPromise.broken = Promise.rejected = newRejected\r\nPromise.pending = newPending\r\n\r\n/**\r\n * Dafualt uncought error handler. It will wait 1 second for you to \r\n * handle the error before rethrowing it if its an Error instance or simple \r\n * logging it otherwise. Feel free to replace this function with one you \r\n * find more useful. Its purely a debugging feature. Technically promises \r\n * shouldn't ever throw since at any time in the future someone could decide \r\n * to handle the error. To void this behaviour just set it to `null`.\r\n * \r\n * @param  {Promise} promise, which was rejected without an error handler\r\n * @param  {Any} error, the reason for its rejection\r\n */\r\n\r\nPromise.onError = function (promise, error) {\r\n\tpromise._throw = setTimeout(function () {\r\n\t\tif (error instanceof Error) {\r\n\t\t\terror.message += ' (Rethrown from rejected promise)'\r\n\t\t\tthrow error\r\n\t\t} else {\r\n\t\t\tconsole && console.warn('(Logged from rejected promise)',error)\r\n\t\t}\r\n\t}, 1000)\r\n}\r\n\r\n/**\r\n * Do something with a promise that has been handled since previously been\r\n * handled by `onError`\r\n * \r\n * @param  {Promise} promise, which previously failed without error handlers\r\n */\r\n\r\nPromise.onCatch = function (promise) {\r\n\tclearTimeout(promise._throw);\r\n\tdelete promise._throw\r\n}\r\n"
	}
	return require("/index.js")
})