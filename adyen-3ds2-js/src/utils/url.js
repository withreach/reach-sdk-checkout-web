
/**
 * @function getUrlOrigin
 * @private
 * @desc Gets the origin from a given url
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