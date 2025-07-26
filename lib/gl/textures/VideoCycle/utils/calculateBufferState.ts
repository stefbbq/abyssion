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
 * @description
 * Calculates buffer state for video transitions, preparation timing, and buffer opacity
 * This is used to determine when to swap video buffers, prepare the next video, and calculate the buffer opacity
 *
 * @param input - The input object containing the current start time, duration, video time, transition trigger point, and whether the next video is prepared
 * @returns The buffer state result containing: elapsed time, progress, if video has looped, if transition should occur, if next video should be prepared and the time to next transition
 */
export const getBufferState = (input: BufferStateInput): BufferStateResult => {
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
