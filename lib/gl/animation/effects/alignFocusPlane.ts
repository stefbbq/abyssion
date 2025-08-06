/**
 * aligns the focus plane if the global function is available
 */
export const alignFocusPlane = (): void => {
  // deno-lint-ignore no-explicit-any
  if (typeof window !== 'undefined' && typeof (window as any).alignFocusPlane === 'function') {
    // deno-lint-ignore no-explicit-any
    ;(window as any).alignFocusPlane()
  }
}
