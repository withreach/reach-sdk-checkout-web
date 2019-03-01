import createIframe from './create-iframe';

const mockCallback = jest.fn();

describe('creating an iframe ', () => {
    test('should attach to the body', () => {
        expect( () => {
            createIframe(false , 'name', 'no-id', '12', '12', mockCallback).reject.toEqual('');
        });
    });
});

describe('creating an iframe while already passing an iframe and a callback function', () => {
    test('the callBack function is being called', done => {
        const object = {};

        function callbackFn(data) {
            // expect(data).toBe('peanut butter');
            done();
        }

        const iframe = document.createElement('iframe');
        const iframeHTML = '<html><body></body></html>';

        iframe.classList.add('test' + 'Class');
        iframe.height = '100';
        iframe.width = '100';
        iframe.name = 'test';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('border', '0');
        iframe.attachEvent = function() {};
        iframe.src = "data:text/html;charset=utf-8," + encodeURIComponent(iframeHTML);

        // Check to see if an object is returned (iframe)
        // (container, name, containerId, height = '0', width = '0', callback)
        createIframe(iframe, 'test', 'adad', '0','0', callbackFn);
    });
});