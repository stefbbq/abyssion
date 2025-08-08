/**
 * calculates normalized scroll progress in the viewport [0..1]
 */
export const calculateScrollProgress = (scrollY: number, viewportHeight: number) => {
  if (viewportHeight <= 0) return 0

  const progress = scrollY / viewportHeight

  if (progress < 0) return 0
  if (progress > 1) return 1

  return progress
}
