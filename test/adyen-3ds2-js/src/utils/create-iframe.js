//const defaultContainer = document.body;
const configObject = {};
configObject.container = undefined;

const addIframeListener = (iframe, callback, container) => {
    if (iframe.attachEvent){
        //Internet explorer backup
        iframe.attachEvent("onload", function(){
            if (callback && typeof callback === "function") {
                callback(iframe.contentWindow, container);
            }
        });
    } else {
        iframe.onload = function(){
            if (callback && typeof callback === "function") {
                callback(iframe.contentWindow, container);
            }
        };
    }
};

/**
 * createIframe
 * @param container {HTMLElement} - the container to place the iframe onto, defaults to document body
 * @param name {String} - the action for the form element
 * @param containerId {String} - the ID to place on the iframe
 * @param width {String} - the width of the iframe, defaults to 0
 * @param height {String} - the height of the iframe, defaults to 0
 * @param callback { Function } - optional, the callback to fire after the iframe has been loaded
 */
const createIframe = (container, name, containerId, width = '0', height = '0', callback) => {

    return new Promise(resolve => {

        if(container instanceof HTMLIFrameElement === false){

            // Resolve node/div functionality (util) --> throw if not node
            if (container) {
                configObject.container = container;
            } else {
                configObject.container = document.body;
            }

            // 1. Create iframe HTML
            const iframe = document.createElement('iframe');
            const iframeHTML = '<html><body></body></html>';

            iframe.classList.add(name + 'Class');
            iframe.width = width;
            iframe.height = height;
            iframe.name = name;
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('border', '0');
            iframe.src = "data:text/html;charset=utf-8," + encodeURIComponent(iframeHTML);

            // 2. Add iframe to container and return it
            const methodIframeContainer = document.createElement('div');
            methodIframeContainer.setAttribute('id', containerId);
            methodIframeContainer.style.width = 0;
            methodIframeContainer.style.height = 0;

            if (configObject.container !== undefined) {

                // Place the iframe container into the container we have established as the 'root'
                configObject.container.appendChild(methodIframeContainer);

                // Place the iframe into the holder
                methodIframeContainer.appendChild(iframe);

                addIframeListener(iframe, callback, methodIframeContainer);

                resolve(iframe);
            }
        }else{

            const iframe = container;
            iframe.height = height;
            iframe.width = width;

            addIframeListener(iframe, callback, null);

            resolve(iframe);
        }

    });
};

export default createIframe;
