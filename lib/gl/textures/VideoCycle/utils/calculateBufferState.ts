import type { BufferState, BufferStateInput } from '../types.ts'

/**
 * Calculates buffer state to determine when to prepare next video and when to transition
 *
 * This pure function determines the optimal timing for video preparation and transitions
 * based on current playback progress and system state. It ensures smooth transitions
 * by triggering next video preparation before the current segment ends.
 *
 * @param input - Buffer state calculation parameters
 * @returns Buffer state with transition timing and progress information
 *
 * @example
 * const bufferState = calculateBufferState({
 *   currentStartTime: 2.5,
 *   currentDuration: 5.0,
 *   currentVideoTime: 4.0,
 *   transitionTriggerPoint: 0.7,
 *   isNextVideoPrepared: true
 * })
 * // Returns: { shouldPrepareNext: false, shouldTransition: true, playbackProgress: 0.6, timeRemaining: 1.5 }
 */
export const calculateBufferState = (input: BufferStateInput): BufferState => {
  const {
    currentStartTime,
    currentDuration,
    currentVideoTime,
    transitionTriggerPoint,
    isNextVideoPrepared,
  } = input

  // Handle edge case of zero duration
  if (currentDuration <= 0) {
    return {
      shouldPrepareNext: false,
      shouldTransition: isNextVideoPrepared,
      playbackProgress: 1.0,
      timeRemaining: 0.0,
    }
  }

  // Calculate the end time of the current segment
  const segmentEndTime = currentStartTime + currentDuration

  // Calculate progress within the current segment (0-1)
  const segmentProgress = currentVideoTime < currentStartTime ? 0 : Math.min((currentVideoTime - currentStartTime) / currentDuration, 1)

  // Calculate time remaining in the current segment
  const timeRemaining = Math.max(segmentEndTime - currentVideoTime, 0)

  // Determine if we should prepare the next video
  // Prepare when we reach the trigger point and next video isn't ready yet
  const shouldPrepareNext = segmentProgress >= transitionTriggerPoint && !isNextVideoPrepared

  // Determine if we should transition to the next video
  // Transition when segment is complete and next video is prepared
  const shouldTransition = segmentProgress >= 1.0 && isNextVideoPrepared

  return {
    shouldPrepareNext,
    shouldTransition,
    playbackProgress: segmentProgress,
    timeRemaining,
  }
}
