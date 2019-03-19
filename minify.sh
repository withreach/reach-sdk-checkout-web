#!/bin/bash

cp adyen-3ds2-js-utils/dist/threeds2-js-utils.js libs/
uglifyjs-folder ./src/ -y -o ./libs/rch.min.js --config-file "./minify-config.json"
uglifyjs-folder ./libs/ -y -o ./dist/reach.min.js --config-file "./minify-config.json"
