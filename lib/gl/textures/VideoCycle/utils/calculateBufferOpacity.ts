import { lc, log } from '@lib/logger/index.ts'

/**
 * @description
 * Calculates buffer opacity for smooth transitions
 *
 * @param transitionProgress - The transition progress (0.0 to 1.0)
 * @param baseOpacity - The base opacity (0.0 to 1.0)
 * @returns The buffer opacity for active and hidden buffers
 */
export const calculateBufferOpacity = (
  transitionProgress: number,
  baseOpacity: number = 0.78,
): { activeOpacity: number; hiddenOpacity: number } => {
  if (transitionProgress <= 0) {
    log.warn(lc.GL_VIDEO, 'Transition progress is less than 0')
    return { activeOpacity: baseOpacity, hiddenOpacity: 0 }
  }

  if (transitionProgress >= 1) {
    log.warn(lc.GL_VIDEO, 'Transition progress is greater than 1')
    return { activeOpacity: 0, hiddenOpacity: baseOpacity }
  }

  // smooth crossfade
  const activeOpacity = baseOpacity * (1 - transitionProgress)
  const hiddenOpacity = baseOpacity * transitionProgress

  return { activeOpacity, hiddenOpacity }
}
