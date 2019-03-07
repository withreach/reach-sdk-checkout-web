# 3DS2 JS SDK
With this SDK, you can accept 3D Secure 2.0 payments via Adyen. This SDK helps you with the management of the 3DS 2.0 challenges. This happens in the form of the creation of `<iframes>`, form `POSTS` using these `<iframes>` and handling the returned 3DS 2.0 results.


## Installation
To add the SDK, perform the following:

1. Clone this repo.
2. Navigate via the command line / terminal to the cloned directory.
3. Run the following command:
   ```npm install```

##### Approach 1
Also run the command:
```npm run build```

This will create a minified version of the 3DS 2.0 SDK, named based on the current version number e.g. *threedsSDK.0.9.5.min.js*. This file will be found in the *dist* directory of the cloned repo.

This file can then be included in your webpage via a ```<script>``` tag:

```
<script src="..path-to-SDK/threedsSDK.0.9.6.js"></script>
```

A global variable ```window.threedsSDK``` will be available, allowing access to the SDK methods.

##### Approach 2
Import threedsSDK directly from the cloned repo:
```
import threedsSDK from 'adyen-3ds2-js';
```

## Usage
The 3DS 2.0 SDK can be used when the payment authorisation result has `"resultCode":"IdentifyShopper"`, as documented in the [3d-secure-2-0 server integration page](https://docs.adyen.com/developers/risk-management/3d-secure-2-0/server-integration).

After receiving this result, take the following parameters from the `RESULT` and initialize the 3DS 2.0 SDK:
* threeDSServerTransID = (`RESULT.additionalData.threeDSServerTransID`)
* threeDSMethodURL = (`RESULT.additionalData.threeds2.threeDSMethodURL`)

Then make sure to have the following parameters ready before initializing the SDK:
* `YOUR_NOTIFICATION_ENDPOINT` - The 3DS Method Notification URL, a fully qualified (absolute) URL that the result of the 3DS Method URL call will be POST-ed to. Usually a page on the merchant's own domain.
* `CONTAINER` - A container to place the challenge `<iframe>` in.

After all these parameters have been retrieved, initialise the SDK as follows:
```
threedsSDK.get3DSMethodStatus(threeDSServerTransID, threeDSMethodURL, YOUR_NOTIFICATION_ENDPOINT, CONTAINER)
```

This `get3DSMethodStatus` function returns a promise with 2 possible outcomes: resolved / rejected.

The resolved function receives an object with a property called `threeDSCompInd` which can contain 3 different outcomes:
```
Y: An iframe has been created, device fingerprinting has happened & the iframe has been redirected to the 3DS Method Notification URL.
N: The creation of the iframe or the call to the 3DS Method URL (threeDSMethodURL) has timed out.
U: Undefined "No fingerprinting has to be done" i.e. no 3DS Method URL (threeDSMethodURL) was specified.
```
In each case perform an [additional request](https://docs.adyen.com/developers/risk-management/3d-secure-2-0/server-integration#request1) to the `/authorise3ds2` endpoint, including the `threeDSCompInd` result.

This results in a response object:
```
const resultObject = {
  "additionalData":{
    "threeds2.threeDS2ResponseData.dsReferenceNumber":"ADYEN-DS-SIMULATOR",
    "threeds2.threeDS2ResponseData.transStatus":"C",
    "threeds2.threeDS2ResponseData.acsChallengeMandated":"Y",
    "threeds2.threeDS2ResponseData.acsURL":"http:\/\/localhost:8080\/threeds2simulator\/services\/ThreeDS2Simulator\/v1\/handle\/eb9c6eb3-57b3-400d-bf2f-4e72bd69dcec",
    "threeds2.threeDS2ResponseData.threeDSServerTransID":"c9200190-5ffe-11e8-954f-26e6f38ae710",
    "threeds2.threeDS2ResponseData.authenticationType":"01",
    "threeds2.threeDS2ResponseData.dsTransID":"73aab3ce-eb39-49e8-8e9b-46fbf8a472f1",
    "threeds2.threeDS2ResponseData.messageVersion":"2.1.0",
    "threeds2.threeDS2Token":"— - BINARY DATA - -",
    "threeds2.threeDS2ResponseData.acsTransID":"eb9c6eb3-57b3-400d-bf2f-4e72bd69dcec",
    "threeds2.threeDS2ResponseData.acsReferenceNumber":"ADYEN-ACS-SIMULATOR"
  },
  "pspReference":"9935272408535455",
  "resultCode":"ChallengeShopper"
}
```

Take the `acsURL` value (the URL the challenge iframe will display):
```
const acsURL = threeDS2ResponseData.acsURL
```

Create the iframe [configuration object](https://docs.adyen.com/developers/3d-secure-2-0/web-sdk-integration/web-sdk-reference-3d-secure-2-0):
```
const iframeConfig = {
size: '01', // The size you'd like the iframe to be can be '01' - '05' as documented
container: '' // Container to place the generated iframe into OR an actual iframe
}
```

Create the `cReqData`:
```
const cReqData = {
challengeWindowSize: iframeConfig.size,
threeDSServerTransID : pResp.additionalData['threeds2.threeDS2ResponseData.threeDSServerTransID'],
acsTransID : pResp.additionalData['threeds2.threeDS2ResponseData.acsTransID'],
messageVersion : pResp.additionalData['threeds2.threeDS2ResponseData.messageVersion'],
messageType : 'CReq'
}
```

Now create the challenge using those parameters:
```
threedsSDK.doChallenge(acsURL, cReqData, iframeConfig);
```

This will create and place an iframe in your specified container, containing a challenge to be completed by the shopper.

The `doChallenge` function returns a promise with 2 possible outcomes: resolved / rejected.

When resolved (challenge was successfully completed) it will return an object containing the following:
```
const resolveObject = {
threeDSServerTransID: 'UNIQUE_SERVER_TRANSACTION_ID',
transStatus: 'Y'
}
```

When rejected (challenge failed):
```
const rejectObject = {
threeDSServerTransID: 'UNIQUE_SERVER_TRANSACTION_ID',
transStatus: 'N'
}
```

Use these values to perform an additional call to the `/authorise3ds2` endpoint and [continue with the payment authorisaton](https://docs.adyen.com/developers/risk-management/3d-secure-2-0/server-integration#step6paymentcompletion).

## See also
* [Complete Documentation](https://docs.adyen.com/developers/risk-management/3d-secure-2-0/web-sdk-integration)
* [SDK Reference](https://docs.adyen.com/developers/risk-management/3d-secure-2-0/web-sdk-integration/web-sdk-reference-3d-secure-2-0)
