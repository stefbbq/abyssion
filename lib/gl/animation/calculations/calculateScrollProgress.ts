/**
 * Calculate scroll progress as a value between 0 and 1
 * Based on current scroll position and window height
 */
export const calculateScrollProgress = (scrollY: number, windowHeight: number): number => {
  return Math.min(scrollY / windowHeight, 1.0)
}
