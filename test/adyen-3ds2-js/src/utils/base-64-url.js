import { log } from "./logger";

/**
 * @function base64urlEncode
 * @private
 *
 * @desc Takes a string and encodes it as a base64url string (https://en.wikipedia.org/wiki/Base64#URL_applications)
 *
 * @example const jsonStr = JSON.stringify( {name:'john', surname:'smith'} );
 *          const base64url = base64urlEncode(jsonStr);
 *
 * @param dataStr : String - data, as a string, to be encoded
 *
 * @returns base64url {String} : a base64url encoded string
 */
const encodeBase64URL = (dataStr) => {
    let base64 = window.btoa(dataStr);
    let base64url = base64.split('=')[0]; // Remove any trailing '='s

    base64url = base64url.replace('/\+/', '-'); // 62nd char of encoding
    base64url = base64url.replace('/\//', '_'); // 63rd char of encoding

    return base64url;
};

/**
 * @function base64urlDecode
 * @private
 *
 * @desc Takes a base64url encoded string and decodes it to a regular string
 *
 * @example const dataStr = base64urlDecode(base64url)
 *          const decodedObj = JSON.parse(dataStr);
 *
 * @param str : String - base64url encoded string
 *
 * @returns regStr {String}
 */
const decodeBase64URL = (str) => {
    let base64 = str;
    base64 = base64.replace('/-/', '+'); // 62nd char of encoding
    base64 = base64.replace('/_/', '/'); // 63rd char of encoding
    switch (base64.length % 4) // Pad with trailing '='s
    {
        case 0:
            break; // No pad chars in this case
        case 2:
            base64 += "=="; break; // Two pad chars
        case 3:
            base64 += "="; break; // One pad char
        default:
            log('### threedsSDK::base64urlDecode:: Illegal base64url string!');
    }

    try {
        return window.atob(base64);
    } catch (e) {
        throw new Error(e);
    }
};

const base64URL = {
    encode : encodeBase64URL,
    decode: decodeBase64URL
};

export default base64URL;