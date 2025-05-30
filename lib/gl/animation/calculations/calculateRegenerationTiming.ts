import ms from 'ms'

/**
 * Get random interval between 1-4 seconds for regeneration
 */
const getRandomInterval = () => ms('1s') + Math.random() * ms('3s')

/**
 * Calculate if layers should regenerate and get next interval
 */
export const calculateRegenerationTiming = (
  currentTime: number,
  lastRegenerateTime: number,
  nextRegenerateInterval: number,
): { shouldRegenerate: boolean; newInterval: number } => {
  const shouldRegenerate = currentTime - lastRegenerateTime > nextRegenerateInterval

  return {
    shouldRegenerate,
    newInterval: shouldRegenerate ? getRandomInterval() : nextRegenerateInterval,
  }
}
