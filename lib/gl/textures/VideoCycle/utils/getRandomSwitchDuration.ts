import { VIDEO_CYCLE_CONFIG } from '../config.ts';

/**
 * Get random duration for video display before switching
 * @returns Random duration in seconds
 */
export const getRandomSwitchDuration = (): number => {
  const { minVideoLength, maxVideoLength } = VIDEO_CYCLE_CONFIG.cycling
  return minVideoLength + Math.random() * (maxVideoLength - minVideoLength)
}
