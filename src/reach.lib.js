import ThreedDS2Utils from '@adyen/threeds2-js-utils/src';

/**
 * Reach Checkout API Web SDK
 *
 * @copyright 2019 Reach
 * @license Apache-2.0
 */

var rch = rch || {};
rch.detail = rch.detail || {};

/**
 * Helper to get the origin from a given url
 *
 * @private
 * @param {string} url - URL to be parsed
 * @return {string} - The origin of the URL
 */
rch.detail.getUrlOrigin = function(url) {
	var pathArray = url.split( '/' );
	if (pathArray.length < 3) {
		return '';
	}
	return pathArray[0] + '//' + pathArray[2];
};

/**
 * Helper to create a form element with a target attribute
 *
 * @private
 * @param {string} name - the name of the form element
 * @param {string} action - the action for the form element
 * @param {string} target - the target for the form element (specifies where the submitted result will open i.e. an iframe)
 * @param {Object} values - key value pairs to be posted from the form
 *
 * @return {Element} - Created form element
 */
rch.detail.createForm = (name, action, target, values) => { 

	//console.log(name)
	//console.log(action, target, values)

	if (!name || !action || !target || !values) {
			throw new Error('Not all required parameters provided for form creation');
	}

	if (name.length === 0 || action.length === 0 || target.length === 0) {
			throw new Error('Not all required parameters have suitable values');
	}

	const form = document.createElement( 'form' );
	form.style.display = 'none';
	form.name = name;
	form.action = action;
	form.method = "POST";
	form.target = target;
	for (const key in values) {
		const input = document.createElement( 'input' );
		input.name = key;
		input.value = values[key];
		form.appendChild( input );
	}
	return form;
};


/**
 * Execute a 3D-Secure v2 cardholder challenge.	This should be called when a
 * `Challenge` result is returned from a Checkout API call.
 *
 * @param {string} url - the challenge URL returned from the Checkout API.
 *
 * @param {string} windowSize -
 *		 a two character string representing the size of the challenge window,
 *		 as documented in the EMV 3-D Secure Specification v2.2.0.
 *		 Possible values:
 *			 01 = 250 x 400
 *			 02 = 390 x 400
 *			 03 = 500 x 600
 *			 04 = 600 x 400
 *			 05 = Full screen
 *
 * @param {Object} iframeContainer -
 *		 the DOM element in which an iframe will be created for the interaction
 *		 with the cardholder.
 *
 * @param {function} callback -
 *		 the function to be called when the interaction has completed
 *		 with an object containing the following:
 *
 *			 authorized: true if the transaction was authorized, else false.
 */
rch.challenge = function(url, windowSize, iframeContainer, callback) {

	// create iframe and POST browser info, windowSize
	const browser = ThreedDS2Utils.getBrowserInfo();
	console.log(browser);
	const postData = {
		challengeWindowSize :
			ThreedDS2Utils.config.validateChallengeWindowSize(windowSize),
		screenWidth : browser.screenWidth,
		screenHeight : browser.screenHeight,
		colorDepth: browser.colorDepth,
		userAgent : browser.userAgent,
		tz : browser.timeZoneOffset,
		language: browser.language,
		javaEnabled: browser.javaEnabled
	};

	const IFRAME_NAME = 'threedsIframe';

	// Create iframe, 0 x 0 dimensions to start
	const iframe = ThreedDS2Utils.createIframe(iframeContainer, IFRAME_NAME);

	// Create a form that will use the iframe to POST data
	const form = rch.detail.createForm('threedsMethodForm', url,
										IFRAME_NAME, postData);
	iframeContainer.appendChild(form);

	const cleanup = function() {
		iframeContainer.removeChild( form );
		iframeContainer.removeChild( iframe );
	};

	// Receive a message posted by the iframe
	const receiveMessage = function(event) {

		if (event.origin != rch.detail.getUrlOrigin(url)) {
			console.log("Ignoring message from", event.origin);
			return;
		}

		console.log("Received message:", event.data);

		if (event.data.challengeWindowSize) {
			// Resize the iframe in preparation for the challenge
			const windowSize
				= ThreedDS2Utils.config.validateChallengeWindowSize(
						event.data.challengeWindowSize);
			const iframeDims
					= ThreedDS2Utils.config.getChallengeWindowSize(windowSize);
			iframe.width = iframeDims[0];
			iframe.height = iframeDims[1];
		}
		else if (event.data.result) {
			// Clean up the iframe and call back after the challenge has completed
			window.removeEventListener("message", receiveMessage);
			cleanup();
			// Expected in result:
			//	 authorized:	true/false
			callback(event.data.result);
		}
	};

	window.addEventListener("message", receiveMessage);
	form.submit();
};

// #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#

export default rch;
