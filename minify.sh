#!/bin/bash

uglifyjs-folder ./src/ -y -o ./libs/rch.min.js --config-file "./minify-config.json"
uglifyjs-folder ./libs/ -y -o ./dist/reach.min.js --config-file "./minify-config.json"
