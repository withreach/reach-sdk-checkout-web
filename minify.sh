#!/bin/bash

cp adyen-3ds2-js/dist/threedsSDK.0.9.6.min.js libs/
uglifyjs-folder ./src/ -y -o ./libs/rch.min.js --config-file "./minify-config.json"
uglifyjs-folder ./libs/ -y -o ./dist/reach.min.js --config-file "./minify-config.json"
