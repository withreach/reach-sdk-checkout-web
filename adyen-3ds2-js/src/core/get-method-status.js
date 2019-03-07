import createIframe from "../utils/create-iframe";
import { createForm } from "../utils/create-form";
import base64URL from "../utils/base-64-url";
import { defaultRootContainer, THREEDS_METHOD_TIMEOUT } from "../globals/config";

let at3DSMethodNotificationUrlResolvedFn;

const checkForResult = (contentWindow, container) => {

    if (contentWindow) {

        try {

            if (contentWindow.location && contentWindow.location.host) {

                at3DSMethodNotificationUrlResolvedFn('Y');
            }
        } catch(e) {
            /** Do nothing but do not throw an error
             * Even though the access to the iframe is not there, we don't want a console error, since we expect this behaviour.
             */
        }
    }
};

export const getMethodStatus = (serverTransactionID, methodURL, threedsMethodNotificationURL, container) => {

    let iframeContainer = defaultRootContainer;

    if (container) {

        if(container instanceof HTMLElement === false){
            throw new Error("The container for the 3DSMethod iframe should be an HTMLElement");
        }

        iframeContainer = container;
    }

    const resolveData = { threeDSCompInd : 'U'};

    let methodUrlTimeout;

    const createMethodFrame = new Promise(function (resolve) {

        if(!methodURL || !methodURL.length){

            resolve(resolveData);

        } else {

            // 1. Create and Base64Url encode a JSON object containing the serverTransactionID & threeDSMethodNotificationURL
            const dataObj = { threeDSServerTransID : serverTransactionID, threeDSMethodNotificationURL : threedsMethodNotificationURL };
            const jsonStr = JSON.stringify(dataObj);
            const base64URLencodedData = base64URL.encode(jsonStr);

            /**
             * Appends and submits a form in the created iframe
             */
            const appendAndSubmitForm = (iframe) => {
                const form = createForm('threedsMethodForm', methodURL, 'threeDSMethodIframe', 'threeDSMethodData', base64URLencodedData);
                iframe.appendChild(form);
                form.submit();
                return iframe.contentWindow;
            };

            /**
             * Creates iframe, then appends and submits form
             */
            const createIframeAndAppendForm = async () => {

                const iframe = await createIframe(iframeContainer, 'threeDSMethodIframe', 'methodIframeContainer', '0', '0', checkForResult);

                const iframeCW = appendAndSubmitForm(iframe);

                const at3DSMethodNotificationUrl = new Promise(function (resolve) {
                    at3DSMethodNotificationUrlResolvedFn = resolve;
                });

                const at3DSMethodNotificationUrlData = await at3DSMethodNotificationUrl;

                resolveData.threeDSCompInd = at3DSMethodNotificationUrlData;
                resolveData.iframeConfig = { container : iframeContainer};

                return iframeCW;
            };

            createIframeAndAppendForm().then( (iframeCW) => {
                    clearTimeout(methodUrlTimeout);
                    resolveData.iframe = iframeCW;
                    resolve(resolveData);// resolve createMethodFrame Promise
                }
            );
        }
    });

    const promiseTimeout = new Promise((resolve) => {
        methodUrlTimeout = setTimeout(() => {
            resolveData.threeDSCompInd = 'N';
            resolve(resolveData); // resolve promiseTimeout Promise
        }, THREEDS_METHOD_TIMEOUT);
    });

    // Promise.race settles when the first one of these promises settles (one is a timeout based promise the other is the createIframe promise)
    // It resolves/rejects with the value received from the settled promise
    const p = Promise.race([
        createMethodFrame,
        promiseTimeout
    ]);

    return p;
};