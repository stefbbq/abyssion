/**
 * Saves debug settings to local storage
 * @param settings - The debug settings object to save
 */
export const saveDebugSettings = (settings: unknown) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('abyssion-debug-settings', JSON.stringify(settings))
}
