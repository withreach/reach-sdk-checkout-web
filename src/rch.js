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
//
// Interact with the Reach consent system.  For more information, see:
//
//   https://docs.gointerpay.net/display/PUB/Consent
//
// ===========================================================================


var rch = rch || {};


// ===========================================================================
// Helpers
//
rch.detail = rch.detail || {};
rch.detail.regex = rch.detail.regex || {};
rch.detail.regex.uuid = /^[A-F0-9]{8}-(?:[A-F0-9]{4}-){3}[A-F0-9]{12}$/i;
rch.detail.regex.fingerprint = rch.detail.regex.uuid; // TODO: ok?
rch.detail.regex.country = /^[A-Z]{2}$/;
rch.detail.regex.currency = /^[A-Z]{3}$/;
rch.detail.regex.iin = /^[0-9]{6}$/;
rch.detail.regex.card = /^[0-9]{15,}$/;
rch.detail.regex.cvv = /^[0-9]{3,4}$/;
rch.detail.regex.year = /^[2-9][0-9]{3,}$/; // no Y10K issues here! :)
rch.detail.regex.month = /^(0?[1-9]|1[0-2])$/;
rch.detail.regex.paymentMethod = /^[A-Z]+$/;
rch.detail.regex.contractIntent = /^[a-zA-Z]+$/;
rch.detail.url = rch.detail.url || {};

// TODO: how to set these?  Add init function.
// rch.init() seems to be conventional  
rch.detail.url.requirements = "https://checkout-dev.gointerpay.net/v2.19/requirements";
rch.detail.url.fingerprint = "https://checkout-dev.gointerpay.net/v2.19/fingerprint";

// ===========================================================================
// Send an HTTP request
rch.detail.request = function(url, entity = null, contentType = null){
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    if(contentType){
      xhr.setRequestHeader("Content-Type", contentType);
    }
    xhr.onload = function(){
      if(xhr.status === 200){
        resolve(xhr.responseText);
      }else{
        reject(xhr.status, xhr.responseText);
      }
    };
    xhr.onerror = function(e){
      reject(e);
    };
    xhr.open(entity ? "POST" : "GET", url);
    xhr.send(entity);
  });
};

// ===========================================================================
// Before authorizing a credit card, determine its eligibility for
// 3-D Secure v2 and perform the initial interaction with the Access
// Control Server if required.
//
//  - merchantId (string)
//      The UUID for the merchant using this service.
// 
//  - deviceFingerprint (string)
//      The Reach device fingerprint determined earlier using the /fingerprint
//      API call.
//
//  - currency (string)
//      The currency being used for the order.
//
//  - country (string)
//      The upper-case 2 character ISO 3166-1-alpha-2 country code of the
//      consumer placing the order.
//
//  - iin (string or number)
//      The Issuer Identification Number, i.e. the first 6 digits of the
//      credit card being used for payment.
// 
// Returns a Promise which resolves with an object containing:
// 
//   - threeDSCompInd (optional string)
//       Per 3-D Secure v2, a value of 'Y' or 'N' to indicate completion of the
//       3DS Method step.
//       Existence of this value indicates that Reach will attempt to
//       authorize the order using 3-D Secure v2 and a cardholder challenge
//       may be required.
//
rch.prepareCardPayment = function(merchantId,
                                  deviceFingerprint,
                                  currency,
                                  country,
                                  iin) {

  return new Promise(function(resolve, reject) {
    
    // Validate input
    const error = function(message, value) {
      return Error("rch.prepareCard: " + message + ": " + value);
    }
    if(!merchantId || !rch.detail.regex.uuid.test(merchantId)){
      throw error("Invalid merchantId", merchantId);
    }
    if (!deviceFingerprint) {
      throw error("Invalid deviceFingerprint", deviceFingerprint);
    }
    if (!currency || currency.length != 3) {
      throw error("Invalid currency", currency);
    }
    if (!country || country.length != 2) {
      throw error("Invalid country", country);
    }
    if (!iin) {
      throw error("Invalid iin", iin);
    }
    iin = Number(iin).toString();
    if (iin.length != 6) {
      throw error("Invalid iin", iin);
    }

    // Construct the requirements URL
    var url = rch.detail.url.requirements + "?";

    const add = function(name, value){
      url += "&" + name + "=" + value;
    };
    add("MerchantId", merchantId);
    add("DeviceFingerprint", deviceFingerprint);
    add("Currency", currency);
    add("IIN", iin);
    add("Country", country);

    // Make the Checkout API request
    rch.detail.request(url).then(function(result) {
      console.log(result);
      var requirements = JSON.parse(result);
      var threeDS = requirements['ThreeDS'];

      if (threeDS) {
        console.log(threeDS);

        // TODO: add browser info to threeDS['MethodNotificationUrl']
        
        window.threedsSDK.getReach3DSMethodStatus(
                            deviceFingerprint, // threeDSServerTransID
                            threeDS['MethodUrl'],
                            threeDS['MethodNotificationUrl'],
                            document.body) // container
        .then(function(resolveData) {

          // create hidden frame, submit form, callback when form has hit 
          // notification URL
          resolve({ threeDSCompInd: resolveData.threeDSCompInd });
        })
        .catch(function(error) {
          reject(error);
        });
      } else {
        // There is no threeDSMethodURL... nothing to do.
        resolve({});
      } 
    })
    .catch(function(error) {
      reject(error);
    });
  });
};



// ===========================================================================
// Execute a 3D-Secure v2 cardholder challenge.  This should be called when a
// `Challenge` result is returned from a Checkout API call.
//
//  - url: the challenge URL returned from the Checkout API.
// 
//  - windowSize: a two character string representing the size of the
//    challenge window, as documented in the EMV 3-D Secure Protocol and Core 
//    Functions Specification v2.2.0. Possible values:  
//      01 = 250 x 400
//      02 = 390 x 400
//      03 = 500 x 600
//      04 = 600 x 400
//      05 = Full screen
//
//  - iframeContainer: an DOM element in which an iframe will be
//    created for the interaction with the cardholder.
//
// Returns a Promise which resolves with an object containing:
// 
//   - challengeCompletionInd: per standard, "Y" if the cardholder challenge
//        was completed and no more information is required from the shopper, 
//        else "N".
//   - authorized:  true if the transaction was authorized, else false.
//
rch.challenge = function(url, windowSize, iframeContainer) {

  var iframeConfig = { size: windowSize,
                       container: iframeContainer };
                       
  // the rest of the data will be filled in by the Reach backend
  var cReqData = { challengeWindowSize: iframeConfig.size };

  return window.threedsSDK.doReachChallenge(url, cReqData, iframeConfig, null);
}

// #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
