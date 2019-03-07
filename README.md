# reach-sdk-checkout-web
Web SDK for the Reach Checkout API

# MINIFICATION

### Prerequisites

* Node.js and uglify: `sudo apt-get install node-uglify`
* uglifyjs-folder (`sudo npm install -g uglifyjs-folder`)

### Adyen 3DS2 Library

If changes are made in the `adyen-3ds2-js/` directory, rebuild as follows:
* Run `npm install` and `npm run build` from `adyen-3ds2-js/`
* Copy `adyen-3ds2-js/dist/threedsSDK.0.9.6.min.js` into `libs`

### Reach SDK

* Run `./minify.sh` to compile all files into a single file in `/dist/` directory

### Testing

* Use `/test/minify-index.html` to ensure minified script is working properly
