export type Operator =
  // comparison operators
  'gt'| 'gte'| 'eq'| 'nil' |
  // logical operators
  'and'| 'or'| 'not' |
  // math operators
  'sum' | 'multiply';

type OperatorExpr = {
  operator: Operator;
}

type ComparisonExpr = {
  success?: any;
  fail?: any;
}

export function isOperatorExpr(expr: any): expr is OperatorExpr {
  return expr?.['operator'];
}

// comparison expressions

export type EqExpr = ComparisonExpr & {
  operator: 'eq',
  children: Expr[],
}

export type GtExpr = ComparisonExpr & {
  operator: 'gt',
  children: Expr[],
}

export type GteExpr = ComparisonExpr & {
  operator: 'gte',
  children: Expr[],
}

export type NilExpr = ComparisonExpr & {
  operator: 'nil',
  children: Expr,
}

// logical expressions

export type OrExpr = ComparisonExpr & {
  operator: 'or',
  children: Expr[],
}

export type AndExpr = ComparisonExpr & {
  operator: 'and',
  children: Expr[],
}

export type NotExpr = ComparisonExpr & {
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
  // comparison expressions
  GteExpr | GtExpr | EqExpr | NilExpr |
  // logical expressions
  NotExpr | AndExpr | OrExpr |
  // math expressions
  SumExpr | MultiplyExpr |
  // other expressions
  AtomicExpr | ContextExpr;
