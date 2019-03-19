// #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
//
// Copyright 2019 Reach
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ===========================================================================


var rch = rch || {};

/**
 * @function getUrlOrigin
 * @private
 * @desc Helper to get the origin from a given url
 * @param {string} url - URL to be parsed
 * @return {string} - The origin of the URL
 */
export const getUrlOrigin = function(url) {
  var pathArray = url.split( '/' );
  if (pathArray.length < 3) {
    return '';
  }
  return pathArray[0] + '//' + pathArray[2];
};

// ===========================================================================
// Execute a 3D-Secure v2 cardholder challenge.  This should be called when a
// `Challenge` result is returned from a Checkout API call.
//
//  - url: the challenge URL returned from the Checkout API.
// 
//  - windowSize: a two character string representing the size of the
//      challenge window, as documented in the EMV 3-D Secure Protocol and 
//      Core Functions Specification v2.2.0. Possible values:  
//        01 = 250 x 400
//        02 = 390 x 400
//        03 = 500 x 600
//        04 = 600 x 400
//        05 = Full screen
//
//  - iframeContainer: an DOM element in which an iframe will be
//      created for the interaction with the cardholder.
//
//  - callback: a function to be called when the interaction has completed 
//      with an object containing the following:
//      
//    - error: an Error, if there was an error processing the request.
//
//    - authorized: true if the transaction was authorized, else false.
//
rch.challenge = function(url, windowSize, iframeContainer, callback) {

  // create iframe and POST browser info, windowSize
  const postData = {
    browserInfo: threeds2utilities.collectBrowserInfo(),
    windowSize: windowSize
  };

  const IFRAME_NAME = 'threedsIframe';

  const challengeWindowSize 
          = threedsutilities.validateChallengeWindowSize(windowSize);
   
  const iframeDims
          = threedsutilities.getChallengeWindowSize(challengeWindowSize);

  // Create iframe with the challenge dimensions
  const iframe = threeds2utilities.createIframe(iframeContainer, IFRAME_NAME, 
                                                iframeDims[0], iframeDims[1]);

  // Create a form that will use the iframe to POST data
  const form = threeds2utilities.createForm('threedsMethodForm', url, 
                                            IFRAME_NAME, 'data', 
                                            JSON.stringify(postData));
  iframeContainer.appendChild(form);
  
  const cleanupForm = function() {
    iframeContainer.removeChild( form );
    // TODO: clean up the iframe?
  }
  
  /* TODO: want a timeout handler?
  setTimeout( function () {
    cleanupForm();
  }, 30000 ); 
  */
  
  // Receive a message posted by the iframe
  const receiveMessage = function(event) {

    if (event.origin != getUrlOrigin(url)) {
      console.log("Ignoring message from", event.origin);
      return;
    }

    window.removeEventListener("message", receiveMessage);
    console.log("Received challenge result:", event.data);
    cleanupForm();
    // Expected data:
    //   authorized:  true/false
    callback(event.data);
  };
  
  window.addEventListener("message", receiveMessage);
  form.submit();
}

// #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
