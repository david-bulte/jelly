export type Operator =
  // evaluate operators
  'gt'| 'gte'| 'eq'| 'nil' |
  // logical operators
  'and'| 'or'| 'not' |
  // math operators
  'sum' | 'multiply';

type OperatorExpr = {
  operator: Operator;
}

type EvalExpr = {
  success?: any;
  fail?: any;
}

export function isOperatorExpr(expr: any): expr is OperatorExpr {
  return expr?.['operator'];
}

// evaluate expressions

export type EqExpr = EvalExpr & {
  operator: 'eq',
  children: Expr[],
}

export type GtExpr = EvalExpr & {
  operator: 'gt',
  children: Expr[],
}

export type GteExpr = EvalExpr & {
  operator: 'gte',
  children: Expr[],
}

export type NilExpr = EvalExpr & {
  operator: 'nil',
  children: Expr,
}

// logical expressions

export type OrExpr = EvalExpr & {
  operator: 'or',
  children: Expr[],
}

export type AndExpr = EvalExpr & {
  operator: 'and',
  children: Expr[],
}

export type NotExpr = EvalExpr & {
  operator: 'not',
  children: Expr,
}

// math expressions

export type SumExpr = {
  operator: 'sum',
  children: Expr[],
}

export type MultiplyExpr = {
  operator: 'multiply',
  children: Expr[],
}

export type AtomicExpr = string | number | boolean | null | undefined;

export type ContextExpr =
  `{{${string}}}` |
  `{{${string}.${string}}}` |
  `{{${string}.${string}.${string}}}` |
  `{{${string}.${string}.${string}.${string}}}` |
  `{{${string}.${string}.${string}.${string}.${string}}}` |
  `{{${string}.${string}.${string}.${string}.${string}.${string}}}` |
  `{{${string}.${string}.${string}.${string}.${string}.${string}.${string}}}`

export function isContextExpr(expr: any): expr is ContextExpr {
  return typeof expr === 'string' && expr.startsWith('{{') && expr.endsWith('}}');
}

export type Expr =
  // evaluate expressions
  GteExpr | GtExpr | EqExpr | NilExpr |
  // logical expressions
  NotExpr | AndExpr | OrExpr |
  // math expressions
  SumExpr | MultiplyExpr |
  // other expressions
  AtomicExpr | ContextExpr;
