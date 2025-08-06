/**
 * attaches event listeners for animation pause/resume control
 */
export const attachEventListeners = (
  visibilityHandler: () => void,
  blurHandler: () => void,
  focusHandler: () => void,
): () => void => {
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', visibilityHandler)
  }

  if (typeof window !== 'undefined') {
    globalThis.addEventListener('blur', blurHandler)
    globalThis.addEventListener('focus', focusHandler)
  }

  // return cleanup function
  return () => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', visibilityHandler)
    }

    if (typeof window !== 'undefined') {
      globalThis.removeEventListener('blur', blurHandler)
      globalThis.removeEventListener('focus', focusHandler)
    }
  }
}
