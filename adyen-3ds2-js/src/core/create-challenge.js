import createIframe from "../utils/create-iframe";
import { createForm } from "../utils/create-form";
import base64URL from "../utils/base-64-url";
import { challengeWindowSizes} from '../globals/config';
import { parseQueryString } from '../utils/parse-query-string';
import { removeChallenge } from '../utils/cleanup-challenge';
import { log } from '../utils/logger';

export const createChallenge = (acsURL, cReqData, iframeConfig, callBack) => {

    const iframeSizeCode = (iframeConfig && iframeConfig.size) ? iframeConfig.size : '01';// Defaults to 250 x 400
    const iframeSize = challengeWindowSizes[iframeSizeCode];
    let iframeName = 'threeDSIframe';

    if (iframeConfig) {

        if(iframeConfig.container instanceof HTMLElement === false){
            throw new Error("A container for the challenge iframe has not been specified or is not an HTMLElement");
        }

        if(iframeConfig.container instanceof HTMLIFrameElement){
            iframeName = iframeConfig.container.getAttribute('name');
        }

        //#######################
        // ASSUMPTION: The cReq data passed to doChallenge is in the correct form just to be stringified
        //#######################
        log('### threedsSDK::doChallenge:: cReqData=', cReqData);

        /**
         * Create and Base64Url encode a JSON object describing a cReq message
         */
        const jsonStr = JSON.stringify(cReqData);
        const base64EncodedcReqData = base64URL.encode(jsonStr);

        return new Promise(function (resolve, reject) {

            const appendAndSubmitForm = (iframe) => {
                const form = createForm('cReqForm', acsURL, iframeName, 'creq', base64EncodedcReqData);
                iframe.appendChild(form);
                form.submit();
                return iframe.contentWindow;
            };

            const checkForResult = (contentWindow, container) => {

                if (contentWindow) {

                    try {

                        if (contentWindow.location) {

                            const result = parseQueryString(contentWindow.location.search).transStatus;
                            if (result) {
                                const threeDSServerTransID = parseQueryString(contentWindow.location.search).threeDSServerTransID;

                                if (result.toLowerCase() === 'y') {
                                    removeChallenge(contentWindow);
                                    resolve({
                                        transStatus: 'Y',
                                        threeDSServerTransID: threeDSServerTransID
                                    });
                                }

                                if (result.toLowerCase() === 'n') {
                                    removeChallenge(contentWindow);
                                    reject({
                                        transStatus: 'N',
                                        threeDSServerTransID: threeDSServerTransID
                                    });
                                }
                            }
                        }
                    } catch(e) {
                        /** Do nothing but do not throw an error
                         * Even though the access to the iframe is not there, we don't want a console error,
                         * since we expect this behaviour.
                         */
                    }
                }
            };

            /** Create the iframe, then append the form
             * @returns {Promise<*>}
             */
            const createIframeAndAppendForm = async () => {
                const iframe = await createIframe(iframeConfig.container, iframeName, iframeName + 'Container', iframeSize[0], iframeSize[1], checkForResult);
                return appendAndSubmitForm(iframe);
            };

            /** Call create iframe and
             * then return a status if a callback has been passed
             * in the createChallenge function.
             */
            createIframeAndAppendForm().then(iframe => {
                // TODO: Check with merchant with status updates are expected
                if (callBack) {
                    const status = {
                        status: 'challenge iframe created',
                    };
                    callBack(status);
                }
            });
        });
    }
};