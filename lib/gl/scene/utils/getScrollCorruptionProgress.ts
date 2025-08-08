import { calculateScrollProgress } from '@libgl/animation/calculations/calculateScrollProgress.ts'

/**
 * Utility to calculate scroll-based effect progress and intensity (0-1)
 * Used for CRT corruption and other scroll-based fades
 */
export const getScrollCorruptionProgress = (scrollY: number, _config?: unknown): { progress: number; intensity: number } => {
  // Progress is 0 at 70% window height, 1 at 150% window height
  const windowHeight = globalThis.innerHeight
  const start = 0.7 * windowHeight
  const end = 1.5 * windowHeight
  const scrollProgress = calculateScrollProgress(scrollY, windowHeight)

  // Calculate normalized progress for intensity
  let corruptionIntensity = 0.0
  if (scrollY > start) {
    const normalizedProgress = Math.min((scrollY - start) / (end - start), 1.0)
    corruptionIntensity = Math.sqrt(normalizedProgress)
  }
  return { progress: scrollProgress, intensity: corruptionIntensity }
}
