import { lc, log } from '@lib/logger/index.ts'

/**
 * @description
 * Calculates optimal preparation timing for next video
 *
 * @param currentDuration - The current video duration
 * @param preparationTime - The preparation time
 * @returns The preparation timing (0.0 to 1.0 progress)
 */
export const calculatePreparationTiming = (
  currentDuration: number,
  preparationTime: number = 1.0,
): number => {
  if (currentDuration <= preparationTime) {
    log.warn(lc.GL_VIDEO, 'Current duration is less than preparation time')
    return 0.5 // prepare halfway through short videos
  }

  const preparationProgress = 1.0 - (preparationTime / currentDuration)
  return Math.max(0.3, preparationProgress) // never prepare before 30% through
}
