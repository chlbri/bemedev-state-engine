export function isFunction(
  value: unknown,
): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}
