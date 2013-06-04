REPORTER=dot

serve: node_modules/.bin
	@node_modules/.bin/serve

test:
	@node_modules/.bin/mocha test/*.test.js \
		--reporter $(REPORTER) \
		--bail

node_modules: component.json node_modules/.bin
	@packin install

node_modules/.bin: package.json
	@npm install mocha
	@npm install http://github.com/jkroso/serve/tarball/1.2.2

clean:
	rm -r node_modules

.PHONY: clean serve test