import { isString } from './is-string';

/**
 * @function parseQueryString
 * @private
 * @desc Parses a string of GET params and returns an object
 * @param {string} str - String to be parsed
 * @return {Object} - The GET params in an object form of key:value pairs
 */
export const parseQueryString = (str) => {
    const result = {};
    if (!str || !isString(str)) {
        return result;
    }
    if (str.substring(0, 1) === '?') {
        str = str.substring(1);
    }
    const parts = str.split('&');
    while (parts.length > 0) {
        const item = parts.shift().split('=');
        const key = item.shift();
        const value = item.join('=');
        if (key && value) {
            result[decodeURIComponent(key)] = decodeURIComponent(value);
        }
    }
    return result;
};