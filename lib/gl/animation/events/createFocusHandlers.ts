/**
 * creates focus and blur event handlers for window focus tracking
 */
export const createFocusHandlers = (
  onPause: () => void,
  onResume: () => void,
) => ({
  handleBlur: () => onPause(),
  handleFocus: () => onResume(),
})
