import { parseQueryString } from "./parse-query-string";

const urlObject = {
    "test": "ja",
    "test2": "1"
};

const url = '?test=ja&test2=1';

describe('Parsing query strings', () => {
    describe('with a correct url and query', () => {
        test('should return', () => {
            expect(parseQueryString(url).test2).toBe('1');
            expect(parseQueryString(url).test).toBe('ja');
            expect(parseQueryString(url)).toMatchObject(urlObject);
        });
    });

    describe('with a correct url and incorrect query', () => {
        test('should return', () => {
            expect(parseQueryString(url).nonExisting).toBe(undefined);
        });
    });


    describe('with a non-string', () => {
        test('should return', () => {

            const staticObject = {
                str : 'test'
            };
            expect(parseQueryString(staticObject).test).toBe(undefined);
        })
    })
});


