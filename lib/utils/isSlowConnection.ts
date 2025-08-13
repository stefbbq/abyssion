/**
 * Detects slow network conditions using the Network Information API (best effort)
 * Returns true for 'slow-2g', '2g', or '3g'. Falls back to false if unsupported.
 */
export const isSlowConnection = (): boolean => {
  try {
    // deno-lint-ignore no-explicit-any
    const nav = (globalThis.navigator as any) || {}
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection
    const effectiveType = connection?.effectiveType as string | undefined
    if (!effectiveType) return false
    const slowTypes = new Set(['slow-2g', '2g', '3g'])
    return slowTypes.has(effectiveType)
  } catch {
    return false
  }
}
