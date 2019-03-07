/**
 * @function createForm
 * @private
 *
 * @desc Generic function for creating a form element
 *
 * @param name {String} - the name of the form element
 * @param action {String} - the action for the form element
 * @param target {String} - the target (iframe name) for the form element
 * @param inputName {String} - the name of the form element holding the base64Url encoded JSON
 * @param inputValue {String} - the base64Url encoded JSON
 *
 * @returns {Element} - Created form element
 */
export const createForm = (name, action, target, inputName, inputValue) => {

    if (!name || !action || !inputName || !inputValue) {
        throw new Error('Not all parameters provided');
    }

    const form = document.createElement( 'form' );
    form.style.display = 'none';
    form.name = name;
    form.action = action;
    form.method = "POST";
    form.target = target;
    const input = document.createElement( 'input' );
    input.name = inputName;
    input.value = inputValue;
    form.appendChild( input );
    return form;
};