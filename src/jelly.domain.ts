export type Operator = 'gt'| 'gte'| 'eq'| 'sum'| 'and'| 'or'| 'not'

type OperatorExpr = {
  operator: Operator;
}

type EvalExpr = {
  success?: any;
  fail?: any;
}

export function isOperatorExpr(expr: any): expr is OperatorExpr {
  return expr['operator'];
}

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

export type SumExpr = {
  operator: 'sum',
  children: Expr[],
}

export type AtomicExpr = string | number | boolean;

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

export type Expr = SumExpr | GteExpr | GtExpr | EqExpr | NotExpr | AndExpr | OrExpr | AtomicExpr | ContextExpr;
