/**
 * calculates normalized scroll progress in the viewport [0..1]
 */
export const calculateScrollProgress = (scrollY: number, viewportHeight: number) => {
  // if viewport height is 0, return 0
  if (viewportHeight <= 0) return 0

  // calculate progress as a ratio of scrollY to viewportHeight
  const progress = scrollY / viewportHeight

  // if progress is less than 0, return 0
  if (progress < 0) return 0
  if (progress > 1) return 1

  return progress
}
