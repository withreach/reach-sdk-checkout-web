export const log = (message) => {
    if (window && window.console && window.log3dssdk) {
        window.console.log(message);
    }
};