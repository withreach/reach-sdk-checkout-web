#!/bin/bash

( cd adyen-3ds2-js-utils && npm run build ) &&
./minify.sh
