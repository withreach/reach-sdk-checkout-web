/**
 * Version 0.9.5
 * 3DS Message version 2.1.0
 */
import 'core-js/fn/promise' // adds 46k (unminified)
import { createChallenge } from './core/create-challenge';
import { getMethodStatus } from './core/get-method-status';

const threedsSDK = {};

/**
 * ### CURRENT ASSUMPTIONS made by the SDK

 The SDK is currently making certain assumptions.

 Regarding the *3DSMethod call* (Device fingerprinting on the ACS):
 + When the iframe is redirected to the *3DSMethodNotificationURL* (the 3rd argument in the call to ```get3DSMethodStatus```)
 we are assuming that there is no data that needs to be extracted from the form that the ACS POSTs to this URL.
 + Therefore no *endpoint* needs to be running at the *3DSMethodNotificationURL* (to extract data and pass it back to the SDK)
 and the *3DSMethodNotificationURL* can, in fact, just be a location within the merchant's domain (the domain that is hosting the payment form where the shopper enters their card details).

 Regarding the *Challenge Flow* (ACS request for extra Shopper credentials/identification):
 + We expect the passed *cReq* data (the 2nd argument in the call to ```doChallenge```) to be in the correct form to just be 'stringified'.
 + An *endpoint* needs to be running at the *notificationURL* - the URL that the ACS redirects the challenge iframe to when the challenge is completed. (The *notificationURL* is passed to the backend in the initial *authorise payment* call.)
 + This *endpoint*, which can be running on *any* domain, needs to be capable of extracting the correct properties from the *cRes* and
 appending them as ```GET``` params (currently we expect the params ```transStatus``` & ```threeDSServerTransID```).
 + The *notificationURL endpoint* then needs to **redirect the iframe** including the expected ```GET``` parameters in the URL.
 + (N.B. It is the presence of a ```transStatus``` parameter in the iframe.location.search property that we use to determine that the challenge has completed)

 */

/**
 * @function get3DSMethodStatus
 * @public
 *
 * @desc Create a form holding base64Url encoded JSON and POST this to the 3DS Method URL via an iframe
 *
 * @param serverTransactionID {String} - 3DS Server Transaction ID
 * @param methodURL {String} - 3DS Method URL for a particular BIN range
 * @param threedsMethodNotificationURL {String} - The 3DS Method Notification URL, a fully qualified (absolute) URL that the result of the 3DS Method URL call will be POST-ed to. Usually a page on the merchant's own domain.
 * @param container {Element} - (optional) Reference to an HTML Element - the parent for the holder of the generated iframe (for the 3DS Method URL call). Defaults to document.body if not specified.
 *
 * @returns Promise {Promise} : The Promise is resolved or rejected with an Object with a property, 'threeDSCompInd', indicating the outcome of the 3DS Method URL call ('Y', 'N' or 'U')
 */
threedsSDK.get3DSMethodStatus = getMethodStatus;

/**
 * @function doChallenge
 * @public
 *
 * @desc Creates a form holding base64Url encoded JSON describing a cReq message and POST this to the ACS URL via an iframe
 *
 * @param acsURL {String} - A URL from the issuer - where the html for the challenge screen resides. Comes from an ARes message indicating a Challenge i.e. transStatus = "C"
 *
 * @param cReqData {Object} - An Object containing the necessary properties to construct a cReq message
 *      @param cReqData.threeDSServerTransID {String} - from an ARes message
 *      @param cReqData.acsTransID {String}  - from an ARes message
 *      @param cReqData.messageVersion {String}  - from an ARes message
 *      @param cReqData.messageType {String}  - "CReq"
 *
 * @param iframeConfig {Object}
 *      @param iframeConfig.container {iframe | Element} - Contains a reference to an iframe OR a reference to an HTML Element (this latter will act as the parent for the holder of the generated iframe)
 *      @param iframeConfig.size {String} - 2 character string representing one of the 5 possible values for the size of the Challenge Window (see EMV 3-D Specification: pg 176, EMVCo_3DS_Spec_210_1017.pdf)
 *
 * @returns createChallenge {Promise} : The Promise is resolved or rejected with an Object with a 'transStatus' property (indicating the outcome of the Challenge: 'Y' or 'N'). The resolved/rejected object also contains a threeDSServerTransID property - a reference to the passed 3DS Server Transaction ID.
 */
threedsSDK.doChallenge = createChallenge;

window.threedsSDK = threedsSDK;

export default threedsSDK;