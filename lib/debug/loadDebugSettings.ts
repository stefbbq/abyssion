/**
 * Loads debug settings from local storage (if available)
 * @returns The parsed debug settings object, or undefined if not found/invalid
 */
export const loadDebugSettings = () => {
  if (typeof window === 'undefined') return undefined
  try {
    const raw = localStorage.getItem('abyssion-debug-settings')
    if (!raw) return undefined
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}
