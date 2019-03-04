# reach-sdk-checkout-web
Web SDK for the Reach Checkout API

# MINIFICATION

### Installation Instructions

* Step 1: Install NodeJS (https://nodejs.org/en/download/)
* Step 2: Install uglify libs (`npm install uglify-js uglifyjs-folder`)

### Usage

* Place all 3rd party javascript files into `libs` directory
* Place all of our javascript files into `src` directory
* Run `sh minify.sh` to compile all files into a single file in `/dist/` directory

### Testing

* Use `/test/minify-index.html` to ensure minified script is working properly
