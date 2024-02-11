import {
  AndExpr, ContextExpr, NilExpr,
  EqExpr,
  Expr,
  GteExpr,
  GtExpr,
  isContextExpr,
  isOperatorExpr, MultiplyExpr,
  NotExpr,
  OrExpr,
  SumExpr
} from "./jelly.domain.ts";

export function evaluate(expr: Expr, context?: any) {

  return _evaluate(expr);

  function _evaluate(expr: Expr) {
    return getFunction(expr)(expr);
  }

  function eq(expr: EqExpr) {
    const left = getValue(expr.children[0]);
    const right = getValue(expr.children[1]);
    return left === right ? (expr.success || true) : (expr.fail || false);
  }

  function gt(expr: GtExpr) {
    const left = getValue(expr.children[0]);
    const right = getValue(expr.children[1]);
    return left > right ? (expr.success || true) : (expr.fail || false);
  }

  function gte(expr: GteExpr) {
    const left = getValue(expr.children[0]);
    const right = getValue(expr.children[1]);
    return left >= right ? (expr.success || true) : (expr.fail || false);
  }

  function nil(expr: NilExpr) {
    let value = getValue(expr.children);
    return value === undefined || value === null;
  }

  function and(expr: AndExpr) {
    return expr.children.every((child: Expr) => getValue(child))
      ? (expr.success || true) : (expr.fail || false);
  }

  function or(expr: OrExpr) {
    return expr.children.some((child: Expr) => getValue(child))
      ? (expr.success || true) : (expr.fail || false);
  }

  function not(expr: NotExpr) {
    return !getValue(expr.children);
  }

  function sum(expr: SumExpr) {
    let result = 0;
    expr.children.forEach((child: Expr) => {
      result += getValue(child);
    });
    return result;
  }

  function multiply(expr: MultiplyExpr) {
    let result = 1;
    expr.children.forEach((child: Expr) => {
      result *= getValue(child);
    });
    return result;
  }

  function getValue(expr: Expr) {
    const f = getFunction(expr);
    return f ? f(expr) : isContextExpr(expr) ? getFromContext(expr) : expr;
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

  function getFunction(expr: Expr): any | ((expr: Expr) => any) {
    if (isOperatorExpr(expr)) {
      const operator = expr.operator;
      switch (operator) {
        case 'gt':
          return gt;
        case 'gte':
          return gte;
        case 'eq':
          return eq;
        case 'nil':
          return nil;
        case 'and':
          return and;
        case 'or':
          return or;
        case 'not':
          return not;
        case 'sum':
          return sum;
        case 'multiply':
          return multiply;
        default:
          assertNever(operator)
      }
    }
    return null;
  }
}

function assertNever(operator: never): never {
  throw new Error("unknown operator " + operator);
}
