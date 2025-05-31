/**
 * Pipe function for composing transformations
 * General utility for functional composition of operations
 */
export const pipe = <T>(...functions: Array<(arg: T) => T>) => (value: T): T =>
  functions.reduce((accumulator, fn) => fn(accumulator), value)
