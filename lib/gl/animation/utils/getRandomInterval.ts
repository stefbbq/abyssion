import ms from 'ms'

/**
 * Generates a random time interval between minimum and maximum duration
 * Pure function - deterministic for given random seed
 */
export const getRandomInterval = (
  minDuration: string = '1s',
  maxDuration: string = '4s',
): number => ms(minDuration) + Math.random() * (ms(maxDuration) - ms(minDuration))
