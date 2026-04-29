import { perFunc } from "../functions/periodicFunction.mjs"
import { isSimple } from "../functions/triggeredFunction.mjs";
import { shaFunc } from "../functions/shaFunction.mjs";

describe('jest', () => {

    test('periodic - число Армстронга (153)', () => {
        expect(perFunc(3, 153)).toBe(true)
    })

    test('periodic - не число Армстронга (123)', () => {
        expect(perFunc(3, 123)).toBe(false)
    })

    test('periodic - проверка 1', () => {
        expect(perFunc(1, 5)).toBe(true)
    })

    test('periodic - граничное значение (0)', () => {
        expect(perFunc(1, 0)).toBe(true)
    })

    test('periodic - большое число Армстронга (9474)', () => {
        expect(perFunc(4, 9474)).toBe(true)
    })

    test('periodic - простое большое число', () => {
        expect(perFunc(4, 9475)).toBe(false)
    })

    test(' sha - находит хэш с простым префиксом', () => {
        const result = shaFunc('test', '0', 0, 100000)

        expect(result.found).toBe(true)
        expect(result.hash.startsWith('0')).toBe(true)
    })

    test('sha - не находит хэш при невозможном префиксе', () => {
        const result = shaFunc('test', 'zzzz', 0, 1000)

        expect(result.found).toBe(false)
    })

    test('sha - возвращает корректное значение', () => {
        const result = shaFunc('abc', '0', 0, 100000)

        if (result.found) {
            expect(typeof result.value).toBe('number')
        }
    })

    test('sha - работает на пустой строке', () => {
        const result = shaFunc('', '0', 0, 100000)

        expect(result.found).toBe(true)
    })

    test('sha - start == end → сразу false', () => {
        const result = shaFunc('test', '0', 5, 5)

        expect(result.found).toBe(false)
    })

    test('triggered - простое число', () => {
        expect(isSimple(7)).toBe(true);
    })

    test('triggered - не простое число', () => {
        expect(isSimple(10)).toBe(false);
    })

    test('triggered - граничное значение', () => {
        expect(isSimple(1)).toBe(false);
    })

    test('triggered - большое простое число', () => {
        expect(isSimple(97)).toBe(true);
    })
});
