import { isObjectLike } from './is-object-like';

const object = {
    "test": "ja",
    "test2": "1"
};

const string = 'test';
const array = ['test', 'test'];
const undef = undefined;

describe('Checking if type is object', () => {
    describe('with ', () => {

        test('an object should return true', () => {
            expect(isObjectLike(object)).toBe(true);
        });

        test('an array should return true', () => {
            expect(isObjectLike(array)).toBe(true);
        });
    });

    describe('with', () => {
        test('string should return false', () => {
            expect(isObjectLike(string)).toBe(false);
        });

        test('undefined should return false', () => {
            expect(isObjectLike(undef)).toBe(false);
        });
    });
});
