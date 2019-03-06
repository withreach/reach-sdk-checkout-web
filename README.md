# reach-sdk-checkout-web
Web SDK for the Reach Checkout API

# MINIFICATION

### Modifications

If we need to access dependencies of adyen library, we have to manually import them into the adyen library and rebuild it. This is done in the following way:

* Follow setup instructions on `Adyen/adyen-3ds2-js` github
* Open `/adyen-3ds2-js/src/index.js`
	* At top of file: add Import from dependency ex. `import createIframe from "./utils/create-iframe";`
	* At bottom of file: add function to main package ex. `threedsSDK.createIframe = createIframe;`
	* Re-compile library using `npm run build` from `/adyen-3ds2-js/` directory
	* `adyen-3ds2-js/dist/*` will be updated, and function can be accessed through `window.threedsSDK.X`

### Installation Instructions

* Step 1: Install NodeJS (https://nodejs.org/en/download/)
* Step 2: Install uglify libs (`npm install uglify-js uglifyjs-folder`)
* Step 3: Might have to install via: `apt-get install node-uglify`

### Usage

* Place all 3rd party javascript files into `libs` directory
* Place all of our javascript files into `src` directory
* Run `sh minify.sh` to compile all files into a single file in `/dist/` directory

### Testing

* Use `/test/minify-index.html` to ensure minified script is working properly
