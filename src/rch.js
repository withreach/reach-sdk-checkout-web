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

// TODO: construct this with browser info in path
rch.detail.url.threeDSMethodNotificationURL = "https://lister.gointerpay.net/~landon/sdk/test/method_notification.html";

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
// Determine what is required for an order to be placed, based on the
// specified information.  The information given should be as close as
// possible to what will be specified when the order is placed, and can be
// called repeatedly when new information or as changes are made.
//
// If called with an IIN or PaymentMethod, this will fingerprint the device
// for 3D Secure 2.0.
//
// The params object:
//
//  MUST contain the following:
//
//   - Currency: the upper-case 3 character ISO 4217 currency code used in the
//     order.
//
//   - DeviceFingerprint: the fingerprint set from a /fingerprint API call.
//     TODO: add SDK method for fingerprint.
//
//  MAY contain ONE OF the following:
//     
//   - IIN: if a credit card will be used as the payment method of the order,
//     this is the first 6 digits of that card.
//
//   - PaymentMethod: if a credit card or contract is not being used as
//     payment for the order, this is the payment method that will be used.
//
//   - ContractId: if payment for the order will be made using an existing
//     contract, this is the ID of that contract.
//
//  and MAY contain:
//
//   - Country: the upper-case 2 character ISO 3166-1-alpha-2 country code of
//     the consumer that will place the order.
//
//   - ContractIntent: if a new contract is to be opened, this is the intent
//     of that contract.  This may be one of "OnFile" or "Instalments".
//
// Returns a Promise which resolves with an object containing:
// 
//   - Name: the name of the Reach company handling the order.
//   - Address: the address of the Reach company.
//   - Country: the country in which the Reach company operates
//   - Logo: the URL of the logo for the Reach company
//   - MerchantName: the name of the Reach company
//   - Regulations: an array of regulations relevant to the order
//       TODO: reference to document for more info?
//   - Collect: an array of TODO
//   - Information: TODO
//   - threeDSCompInd: indication of 3DS2 fingerprinting success, to be
//       specified in subsequent Checkout API requests
//
rch.requirements = function(merchantId, params){

  return new Promise(function(resolve, reject) {
    
    if(!merchantId || !rch.detail.regex.uuid.test(merchantId)){
      throw Error("rch.requirements: Invalid MerchantId: " + merchantId);
    }
  
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Find all the params and start building the request.  
  
    var url = rch.detail.url.requirements + "?MerchantId=" + merchantId;
  
    var checkAndAdd = function(name, re, required = false){
      var val = params[name];
      if(typeof(val) === "string" && re.test(val)){
        url += "&" + name + "=" + val;
      }else if(typeof(val) !== "undefined"){
        throw Error("rch.requirements: invalid " + name + ": " + val);
      }else if(required){
        throw Error("rch.requirements: missing " + name);
      }
    };
  
    checkAndAdd("Currency",          rch.detail.regex.currency, true);
    checkAndAdd("DeviceFingerprint", rch.detail.regex.fingerprint, true);
    checkAndAdd("Country",           rch.detail.regex.country);
    checkAndAdd("IIN",               rch.detail.regex.iin);
    checkAndAdd("PaymentMethod",     rch.detail.regex.paymentMethod);
    checkAndAdd("ContractId",        rch.detail.regex.uuid);
    checkAndAdd("ContractIntent",    rch.detail.regex.contractIntent);

    if(((("IIN" in params) ? 1 : 0) +
        (("PaymentMethod" in params) ? 1 : 0) +
        (("ContractId" in params) ? 1 : 0)) > 1){
      throw Error("rch.requirements: only one of IIN, PaymentMethod, " +
                  "or ContractId may be specified");
    }
  
    rch.detail.request(url).then(function(result) {
      console.log(result);
      var requirements = JSON.parse(result)['Entity'];

      // TODO: return this from /requirements
      requirements['threeDSMethodURL'] = "https://pal-test.adyen.com/threeds2simulator/acs/startMethod.shtml";

      if (requirements['threeDSMethodURL']) {
        
        console.log(params['DeviceFingerprint']);
        console.log(requirements['threeDSMethodURL']);
        console.log(rch.detail.url.threeDSMethodNotificationURL);
        window.threedsSDK.getReach3DSMethodStatus(params['DeviceFingerprint'], // threeDSServerTransID
                                                  requirements['threeDSMethodURL'],
                                                  rch.detail.url.threeDSMethodNotificationURL,
                                                  document.body) // container
        .then(function(resolveData) {

          // create hidden frame, submit form, add onload method to check 
          // iframe location; callback when form has hit notification URL
          requirements['threeDSCompInd'] = resolveData.threeDSCompInd;
          resolve(requirements);
          
        });
      } else {
        // There is no threeDSMethodURL... nothing to do.
        resolve(requirements);
      } 
    });
  });
};


// ===========================================================================
// Execute a 3DSecure 2.0 cardholder challenge.  This should be called when a
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
//   - transStatus: indication of 3DS2 authentication success, to be
//       specified in subsequent Checkout API requests
//
rch.challenge = function(url, windowSize, iframeContainer) {

  return new Promise(function(resolve, reject) {
    var iframeConfig = { size: windowSize,
                         container: iframeContainer };
                         
    // the rest of the data will be filled in by the Reach backend
    // TODO: implement backend
    var cReqData = { challengeWindowSize: iframeConfig.size };
    window.threedsSDK.doReachChallenge (url, cReqData, iframeConfig, null)
    .then(function(resolveData) {
      resolve({ transStatus: resolveData.transStatus }) // TODO: result of authorization?
    });
  });
}

// #*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#
