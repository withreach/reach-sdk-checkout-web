
distfile = dist/reach.min.js
sources = $(wildcard src/*.js)
webpack = node_modules/.bin/webpack

all: $(distfile)

clean:
	rm $(distfile)

$(distfile): $(sources) $(webpack)
	$(webpack)
	
$(webpack):
	npm install
	