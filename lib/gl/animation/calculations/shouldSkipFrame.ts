/**
 * determines if the current frame should be skipped based on target FPS
 */
export const shouldSkipFrame = (
  timeSinceLastRender: number,
  targetFPS: number,
): boolean => {
  const frameInterval = 1000 / targetFPS
  return timeSinceLastRender < frameInterval
}
