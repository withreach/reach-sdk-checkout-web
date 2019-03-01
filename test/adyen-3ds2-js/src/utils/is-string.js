import { isObjectLike } from './is-object-like';

/**
 * Used to resolve the ['toStringTag'](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 * @private
 */
const objToString = Object.prototype.toString;

/**
 * @function isString
 * @private
 * @desc Checks if value is classified as a String primitive or object
 * @param {*} value The value to check
 * @return {boolean} Returns true if 'value' is correctly classified, else false
 */
export const isString = value => {
    const stringTag = '[object String]';
    return typeof value === 'string' || (isObjectLike(value) && objToString.call(value) === stringTag);
};
