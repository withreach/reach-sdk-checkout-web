/**
 * @function isObjectLike
 * @private
 * @desc Checks if value is object-like
 * @param {*} value The value to check
 * @return {boolean} Returns true if value is object-like, else false
 */
export const isObjectLike = value => {
    return !!value && typeof value === 'object';
};