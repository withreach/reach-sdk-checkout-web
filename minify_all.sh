#!/bin/bash

( cd adyen-3ds2-js && npm run build ) &&
./minify.sh
