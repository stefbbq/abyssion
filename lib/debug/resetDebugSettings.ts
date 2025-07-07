/**
 * Resets debug settings to defaults and clears local storage
 */
export const resetDebugSettings = () => {
  if (typeof window !== 'undefined') localStorage.removeItem('abyssion-debug-settings')
}
