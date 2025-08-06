/**
 * creates a visibility change handler that pauses/resumes animation based on document visibility
 */
export const createVisibilityHandler = (
  onPause: () => void,
  onResume: () => void,
) =>
() => {
  if (document.hidden) onPause()
  else onResume()
}
