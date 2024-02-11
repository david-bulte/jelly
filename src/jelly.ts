import {
  AndExpr, ContextExpr,
  EqExpr,
  Expr,
  GteExpr,
  GtExpr,
  isContextExpr,
  isOperatorExpr,
  NotExpr,
  OrExpr,
  SumExpr
} from "./jelly.domain.ts";

export function evaluate(expression: Expr, context?: any) {

  return _evaluate(expression);

  function _evaluate(expression: Expr) {
    return getFunction(expression)(expression);
  }

  function sum(expression: SumExpr) {
    let result = 0;
    expression.children.forEach((child: Expr) => {
      result += getValue(child);
    });
    return result;
  }

  function eq(expression: EqExpr) {
    const left = getValue(expression.children[0]);
    const right = getValue(expression.children[1]);
    return left === right ? (expression.success || true) : (expression.fail || false);
  }

  function gt(expression: GtExpr) {
    const left = getValue(expression.children[0]);
    const right = getValue(expression.children[1]);
    return left > right ? (expression.success || true) : (expression.fail || false);
  }

  function gte(expression: GteExpr) {
    const left = getValue(expression.children[0]);
    const right = getValue(expression.children[1]);
    return left >= right ? (expression.success || true) : (expression.fail || false);
  }

  function and(expression: AndExpr) {
    return expression.children.every((child: Expr) => getValue(child))
      ? (expression.success || true) : (expression.fail || false);
  }

  function or(expression: OrExpr) {
    return expression.children.some((child: Expr) => getValue(child))
      ? (expression.success || true) : (expression.fail || false);
  }

  function not(expression: NotExpr) {
    return !getValue(expression.children);
  }

  function getValue(expression: Expr) {
    const f = getFunction(expression);
    return f ? f(expression) : isContextExpr(expression) ? getFromContext(expression) : expression;
  }

  function getFromContext(expression: ContextExpr) {
    let _context = context;
    let segments = expression
      .substring(2, expression.length - 2)
      .split('.');
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      _context = _context[segment];
      if (_context) {
        if  (i === (segments.length - 1) ) {
          return _context;
        }
      } else {
        return undefined;
      }
    }
  }

  function getFunction(expression: Expr): any | ((expr: Expr) => any) {
    if (isOperatorExpr(expression)) {
      switch (expression.operator) {
        case 'gt':
          return gt;
        case 'gte':
          return gte;
        case 'eq':
          return eq;
        case 'sum':
          return sum;
        case 'and':
          return and;
        case 'or':
          return or;
        case 'not':
          return not;
        default:
          throw new Error('unknown operator')
      }
    }
    return null;
  }
}


