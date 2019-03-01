import { getMethodStatus } from './get-method-status';

beforeEach(() => {
    jest.resetModules();
});

/**
* @param serverTransactionID {String} - 3DS Server Transaction ID
* @param methodURL {String} - 3DS Method URL for a particular BIN range
* @param threedsMethodNotificationURL {String} - The 3DS Method Notification URL, a fully qualified (absolute) URL that the result of the 3DS Method URL call will be POST-ed to. Usually a page on the merchant's own domain.
* @param container {Element} - (optional) Contains an HTML Element - the parent for the holder of the generated iframe (for the 3DS Method URL call). Defaults to document.body if not specified.
*/
const uObject = {
    threeDSCompInd: "U"
};

const nObject = {
    threeDSCompInd: "N"
};

const resolveObject = {
    threeDSCompInd: "Y"
};


describe('getMethodStatus returns a promise and', () => {

    test('resolves with a U state when called without any details', () => {
        return expect(getMethodStatus()).resolves.toEqual(uObject);
    });

    // test('when passed no container resolves to an iframe, status Y and no container', () => {
    //     expect(getMethodStatus('test', 'not-a-url', 'not-a-url','non-element')).resolves.toEqual(expect.objectContaining(resolveObject));
    // });

    // test('when passed no container resolves to an iframe, status Y and no container', () => {
    //     expect(getMethodStatus('test', 'not-a-url', 'not-a-url','non-element')).resolves.toEqual(expect.objectContaining(resolveObject));
    // });

    test('when passing in a nonsense element / no container should fail', () => {
        expect(() => {
            expect(getMethodStatus('test', 'not-a-url', 'not-a-url','non-element')).toThrow('The container for the 3DSMethod iframe should be an HTMLElement')
        }).toThrow('The container for the 3DSMethod iframe should be an HTMLElement');
    });

    test('when passing an object returns a promise', () => {
        document.body.innerHTML =
            '<div>' +
            '  <span id="container" />' +
            '</div>';

        const container = document.getElementById('container');

        expect(getMethodStatus('test', 'not-a-url', 'not-a-url', container)).resolves.toEqual(expect.objectContaining(resolveObject));
    });

    test('should time out when the first promise is taking too long', (done) => {

        jest.doMock("../utils/create-iframe", () => () => new Promise(() => {} ));
        jest.doMock("../globals/config", () => ({
            THREEDS_METHOD_TIMEOUT: 100,
            defaultRootContainer : 'whatever'
        }));

        document.body.innerHTML =
            '<div>' +
            '  <span id="container" />' +
            '</div>';

        const container = document.getElementById('container');
        const { getMethodStatus: getMethodStatusFunction } = require('./get-method-status');

        getMethodStatusFunction('test', 'not-a-url', 'not-a-url', container).then(result => {
            expect(result).toEqual(nObject);
                done();
        })
    });

    test('Should attach to the body of the document when not passesd a container', () => {
        expect(() => {
            expect(getMethodStatus('', 'not-a-url', 'not-a-url','non-element')).toThrow('The container for the 3DSMethod iframe should be an HTMLElement')
        }).toThrow('The container for the 3DSMethod iframe should be an HTMLElement');
    })
});
