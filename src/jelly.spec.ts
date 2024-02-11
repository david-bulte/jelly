// sum.test.js
import {describe, expect, test} from 'vitest'
import {evaluate} from "./jelly.ts";
import {Expr} from "./jelly.domain.ts";

describe('jelly', () => {

  test('simple sum', () => {
    const expr: Expr = {
      operator: 'sum',
      children: [1, 2, 3]
    };
    expect(evaluate(expr)).toBe(6)
  })

  test('simple minus', () => {
    const expr: Expr = {
      operator: 'sum',
      children: [8, -4]
    };
    expect(evaluate(expr)).toBe(4)
  })

  test('sum of sums', () => {
    const expr: Expr = {
      operator: 'sum',
      children: [1, {
        operator: 'sum',
        children: [2, 3]
      }]
    };
    expect(evaluate(expr)).toBe(6)
  })

  test('sum of sum and minus', () => {
    const expr: Expr = {
      operator: 'sum',
      children: [{
        operator: 'sum',
        children: [-1, -1]
      }, {
        operator: 'sum',
        children: [2, 3]
      }]
    };
    expect(evaluate(expr)).toBe(3)
  })

  test('simple equation', () => {
    const expr: Expr = {
      operator: 'eq',
      children: [1, 1]
    };
    expect(evaluate(expr)).toBe(true)
  })

  test('simple equation fail', () => {
    const expr: Expr = {
      operator: 'eq',
      children: [1, 2]
    };
    expect(evaluate(expr)).toBe(false)
  })

  test('equation with sum', () => {
    const expr: Expr = {
      operator: 'eq',
      children: [3, {
        operator: 'sum',
        children: [1, 2]
      }]
    };
    expect(evaluate(expr)).toBe(true)
  })

  test('equation with custom success and fail values', () => {
    let expr: Expr = {
      operator: 'eq',
      children: [1, 1],
      success: ':)',
      fail: ':('
    };
    expect(evaluate(expr)).toBe(':)')

    expr = {
      operator: 'eq',
      children: [1, 2],
      success: ':)',
      fail: ':('
    };
    expect(evaluate(expr)).toBe(':(')
  })

  test('simple greater than', () => {
    const expr: Expr = {
      operator: 'gt',
      children: [2, 1]
    };
    expect(evaluate(expr)).toBe(true)
  })

  test('validate with and', () => {
    const expr: Expr = {
      operator: 'and',
      children: [true, true]
    };
    expect(evaluate(expr)).toBe(true)
  })

  test('validate with complex and', () => {
    const expr: Expr = {
      operator: 'and',
      children: [{
        operator: 'eq',
        children: [3, {
          operator: 'sum',
          children: [1, 2]
        }]
      }, {
        operator: 'eq',
        children: [3, {
          operator: 'sum',
          children: [-5, 8]
        }]
      }]
    };
    expect(evaluate(expr)).toBe(true)
  })

  test('validate with or', () => {
    const expr: Expr = {
      operator: 'or',
      children: [true, true, false]
    };
    expect(evaluate(expr)).toBe(true)
  })

  test('validate with or', () => {
    const expr: Expr = {
      operator: 'or',
      children: [false, false, {
        operator: 'eq',
        children: [3, 3]
      }]
    };
    expect(evaluate(expr)).toBe(true)
  })

  test('validate with or fail', () => {
    const expr: Expr = {
      operator: 'or',
      children: [false, false, {
        operator: 'eq',
        children: [3, 1]
      }]
    };
    expect(evaluate(expr)).toBe(false)
  })

  test('validate with not', () => {
    const expr: Expr = {
      operator: 'not',
      children: false
    }
    expect(evaluate(expr)).toBe(true)
  })

  test('complex', () => {
    const input1 = {value: 3};
    const input2 = {value: 2};

    const expr: Expr = {
      operator: 'sum',
      children: [
        {
          operator: 'gt',
          children: [
            {
              operator: 'sum',
              children: [
                {operator: 'eq', children: [input1.value, 2], success: 1, fail: 0},
                {operator: 'eq', children: [input2.value, 2], success: 1, fail: 0},
              ],
            },
            1,
          ],
          success: -0.152,
          fail: 0,
        },
        {operator: 'eq', children: [input1.value, 3], success: -0.074, fail: 0},
        {operator: 'eq', children: [input2.value, 3], success: -0.166, fail: 0},
      ],
    };

    expect(evaluate(expr)).toBe(-0.074)

  })

  test('eq with context', () => {
    const expr: Expr = {
      operator: 'eq',
      children: ['coffee', '{{person.favoriteDrink}}']
    };
    expect(evaluate(expr, {person: {name: 'Dale Cooper', favoriteDrink: 'coffee'}})).toBe(true)
  })

})
