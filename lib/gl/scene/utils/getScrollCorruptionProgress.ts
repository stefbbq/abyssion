import { calculateScrollProgress } from '@libgl/animation/calculations/calculateScrollProgress.ts'
import { CORRUPTION_INTENSITY_EXPONENT, GLOBAL_FADE_END_THRESHOLD, GLOBAL_FADE_START_THRESHOLD } from '@libgl/constants.ts'

/**
 * Utility to calculate scroll-based effect progress and intensity (0-1)
 * Used for CRT corruption and other scroll-based fades
 */
export const getScrollCorruptionProgress = (
  scrollY: number,
  _config?: unknown,
): {
  progress: number
  intensity: number
} => {
  // Progress is 0 at start threshold of window height, 1 at end threshold
  const windowHeight = globalThis.innerHeight
  const start = GLOBAL_FADE_START_THRESHOLD * windowHeight
  const end = GLOBAL_FADE_END_THRESHOLD * windowHeight
  const scrollProgress = calculateScrollProgress(scrollY, windowHeight)

  // Calculate normalized progress for intensity
  let corruptionIntensity = 0.0
  if (scrollY > start) {
    const normalizedProgress = Math.min((scrollY - start) / (end - start), 1.0)
    corruptionIntensity = Math.pow(normalizedProgress, CORRUPTION_INTENSITY_EXPONENT)
  }

  return { progress: scrollProgress, intensity: corruptionIntensity }
}
