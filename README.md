# reach-sdk-checkout-web

Web SDK for the [Reach Checkout API](https://docs.withreach.com/display/PUB/Technical+Integration).

## Usage

There is a minified version of the SDK in [dist/](dist/).
See [test/index.html](test/index.html) for examples of the SDK in use.

### challenge()

When a `Challenge` action is returned from `/checkout`, `/authorize` or
`/openContract`, call [challenge()](src/reach.lib.js#L68) with the URL included in the API response. 
```javascript
window.rch.challenge(challengeUrl, windowSize, iframeContainer, callback);
``` 

This will:
* create an iframe, initially with 0x0 dimensions
* perform a fingerprinting step required by 3-D Secure v2
* attempt authorization

Then, if interaction with the shopper is required:
* resize the iframe to the dimensions dictated by the `windowSize` parameter
* present the issuer's authentication user interface
* re-attempt authorization

On completion, the iframe is removed and the supplied callback function is
called with an indication of authorization success or failure, e.g. 
`{ "authorized" : true }`.

Note that the challenge can be attempted only once for a transaction, per
the [3-D Secure v2 specification](https://www.emvco.com/emv-technologies/3d-secure/).


## Rebuilding Minified JavaScript 

* Download repository
* Run `npm install`
* Run `webpack`
* Output should be installed into the `dist/` directory

### Testing

* Use `/test/index.html` to ensure minified script is working properly
