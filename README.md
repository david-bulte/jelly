# Jelly - JSON Expression language

Built as a small side project because what else to do on a gray 
dull weekend with no cyclocross on TV :) ?

## Why Jelly? 

Jelly expressions are simple expressions built in JSON
that can be used to perform validation, filtering, 
calculated fields, authorization checks...

While Jelly expressions _can_ be run from code (see examples 
below), we think (hope) they will typically be used in 
"scratch like" applications to allow end users to easily 
build queries, filters etc...

## Expression types

There exist all kind of expressions (e.g. logical operator expressions, 
math expressions, comparison expressions) and we plan to add more.

Currently we have:

- logical operator expressions: and, or, not
- math expressions: sum, multiply
- comparison expressions: eq, gt, gte, nil

## Examples

Here some examples copied from the test suite:

Simple sum:
```typescript
    const expr: Expr = {
      operator: 'sum',
      children: [1, 2, 3]
    };
    expect(evaluate(expr)).toBe(6)
```

Combining comparison and sum:

```typescript
    const expr: Expr = {
        operator: 'eq',
        children: [3, {
            operator: 'sum',
            children: [1, 2]
        }]
    };
    expect(evaluate(expr)).toBe(true)
```

Comparison expression with custom success and fail hooks 
(default success is _true_ and fail is _false_):

```typescript
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
```

One can pass a context to the evaluate function. String expressions
(wrapped in {{ and }}) can obtain values from this context.

```typescript
    const expr: Expr = {
      operator: 'eq',
      children: ['coffee', '{{person.favoriteDrink}}']
    };
    expect(evaluate(expr, {person: {name: 'Dale Cooper', favoriteDrink: 'coffee'}})).toBe(true)
```

A more complex example:

```typescript
    const expr: Expr = {
      operator: 'sum',
      children: [
        {
          operator: 'gt',
          children: [
            {
              operator: 'sum',
              children: [
                {operator: 'eq', children: ['{{form.input1.value}}', 2], success: 1, fail: 0},
                {operator: 'eq', children: ['{{form.input2.value}}', 2], success: 1, fail: 0},
              ],
            },
            1,
          ],
          success: 3,
          fail: 0,
        },
        {operator: 'eq', children: ['{{form.input1.value}}', 3], success: 6, fail: 0},
        {operator: 'eq', children: ['{{form.input2.value}}', 3], success: 2, fail: 0},
      ],
    };
    
    const form = {input1: {value: 3}, input2: {value: 2}};
    expect(evaluate(expr, {form})).toBe(6)
```