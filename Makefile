clean:
	rm -fr build components

watch:
	rewatch index.js *.css -c "make build"

publish:
	@component publish

test:
	@npm install
	@node_modules/.bin/karma start --single-run

doc:
	@webpack example/index.js example/bundle.js --module-bind "css=style!css"
	@ghp-import example -p -n

.PHONY: clean test doc
