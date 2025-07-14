// the buffer state input
type BufferStateInput = {
  // current video start time
  readonly currentStartTime: number
  // current video duration
  readonly currentDuration: number
  // current video element time
  readonly currentVideoTime: number
  // when transition should occur (0.0 to 1.0)
  readonly transitionTriggerPoint: number
  // whether next video is prepared
  readonly isNextVideoPrepared: boolean
}

// the buffer state result
type BufferStateResult = {
  // elapsed time since video started
  readonly elapsedTime: number
  // progress through current video (0.0 to 1.0)
  readonly progress: number
  // whether video has looped
  readonly hasLooped: boolean
  // whether transition should occur
  readonly shouldTransition: boolean
  // whether next video should be prepared
  readonly shouldPrepareNext: boolean
  // time until next transition
  readonly timeUntilTransition: number
}

/**
 * Calculates buffer state for video transitions
 *
 * Pure function that determines when to swap video buffers
 */
export const calculateBufferState = (input: BufferStateInput): BufferStateResult => {
  const {
    currentStartTime,
    currentDuration,
    currentVideoTime,
    transitionTriggerPoint,
    isNextVideoPrepared,
  } = input

  const elapsedTime = currentVideoTime - currentStartTime
  const hasLooped = currentVideoTime < currentStartTime
  const progress = hasLooped ? 1.0 : Math.min(elapsedTime / currentDuration, 1.0)

  const shouldTransition = hasLooped || (progress >= 1.0)
  const shouldPrepareNext = !isNextVideoPrepared && (progress >= transitionTriggerPoint)

  const timeUntilTransition = hasLooped ? 0 : Math.max(0, currentDuration - elapsedTime)

  return {
    elapsedTime,
    progress,
    hasLooped,
    shouldTransition,
    shouldPrepareNext,
    timeUntilTransition,
  }
}

/**
 * Calculates optimal preparation timing for next video
 *
 * Returns when to start preparing next video (0.0 to 1.0 progress)
 */
export const calculatePreparationTiming = (
  currentDuration: number,
  preparationTime: number = 1.0,
): number => {
  if (currentDuration <= preparationTime) return 0.5 // prepare halfway through short videos

  const preparationProgress = 1.0 - (preparationTime / currentDuration)
  return Math.max(0.3, preparationProgress) // never prepare before 30% through
}

/**
 * Calculates buffer opacity for smooth transitions
 *
 * Returns opacity values for active and hidden buffers
 */
export const calculateBufferOpacity = (
  transitionProgress: number,
  baseOpacity: number = 0.78,
): { activeOpacity: number; hiddenOpacity: number } => {
  if (transitionProgress <= 0) {
    return { activeOpacity: baseOpacity, hiddenOpacity: 0 }
  }

  if (transitionProgress >= 1) {
    return { activeOpacity: 0, hiddenOpacity: baseOpacity }
  }

  // smooth crossfade
  const activeOpacity = baseOpacity * (1 - transitionProgress)
  const hiddenOpacity = baseOpacity * transitionProgress

  return { activeOpacity, hiddenOpacity }
}
