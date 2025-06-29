// deno-lint-ignore-file no-explicit-any

/**
 * Pipe function for composing transformations of different types
 * General utility for functional composition of operations
 */
export const pipe = (value: any, ...fns: Array<(arg: any) => any>): any => fns.reduce((acc, fn) => fn(acc), value)
