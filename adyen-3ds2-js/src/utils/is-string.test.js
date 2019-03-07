import { isString } from './is-string';


const number = 1;
const object = {
    1: 'test'
};

const array = ['dasd', 'test'];

const string = 'fine';

describe('Checking if a value is a string', () => {
    describe('with an object / number', () => {
        test('should return false ', () => {
            expect(isString(number)).toBe(false);
            expect(isString(object)).toBe(false);
            expect(isString(array)).toBe(false);
        });
    });

    describe('with a string', () => {
        test('should return true', () => {
            expect(isString(string)).toBe(true);
        });
    });
});
