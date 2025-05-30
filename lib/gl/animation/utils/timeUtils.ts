import ms from 'ms'

/**
 * Generates a random time interval between minimum and maximum duration
 */
export const getRandomInterval = (
  minDuration: string = '1s',
  maxDuration: string = '4s',
): number => ms(minDuration) + Math.random() * (ms(maxDuration) - ms(minDuration))

/**
 * Calculates safe modulated time to prevent accumulation issues
 */
export const getSafeModulatedTime = (
  time: number,
  moduloDuration: string = '1000s',
): number => time % ms(moduloDuration)

/**
 * Checks if enough time has passed for an FPS-based update
 */
export const shouldUpdateForFps = (
  currentTime: number,
  lastUpdateTime: number,
  fps: number,
): boolean => {
  const timeSinceLastUpdate = currentTime - lastUpdateTime
  const updateInterval = 1000 / fps // Convert fps to milliseconds per frame
  return timeSinceLastUpdate >= updateInterval
}
