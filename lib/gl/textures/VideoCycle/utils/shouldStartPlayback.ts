/**
 * Determines if video playback should start based on available videos and current state
 *
 * @example
 * const canStart = shouldStartPlayback(3, false) // true
 * const cannotStart = shouldStartPlayback(1, false) // false
 */
export const shouldStartPlayback = (videoCount: number, isPlaying: boolean): boolean => videoCount >= 2 && !isPlaying
