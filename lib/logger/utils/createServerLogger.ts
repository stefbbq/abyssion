import { LogContext } from '../constants.ts'

/**
 * Creates a Deno-idiomatic log function that outputs without color/styles
 * @param ctx The log context
 * @param args Arguments to log
 */
export const createServerLogger = () => (ctx: LogContext, ...args: unknown[]): void => {
  const prefix = `[${ctx}]`
  if (args[0] && typeof args[0] === 'string') {
    globalThis.console.log(`${prefix} ${args[0]}`, ...args.slice(1))
  } else {
    globalThis.console.log(prefix, ...args)
  }
}
