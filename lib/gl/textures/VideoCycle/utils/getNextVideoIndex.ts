import { VIDEO_CYCLE_CONFIG } from '../config.ts';

/**
 * Get the index for the next video to play while avoiding recent videos
 * @param currentIndex Current video index
 * @param recentIndices Array of recent video indices to avoid
 * @param totalVideos Total number of available videos
 * @returns Index of the next video to play
 */
export const getNextVideoIndex = (
  currentIndex: number,
  recentIndices: number[],
  totalVideos: number
): number => {
  if (totalVideos <= 1) return 0;
  
  // Create a list of indices to avoid (current + recent)
  const indicesToAvoid = [currentIndex, ...recentIndices].slice(0, VIDEO_CYCLE_CONFIG.cycling.antiRepeat);
  
  // If we have almost as many videos to avoid as total videos, just pick any that's not current
  if (indicesToAvoid.length >= totalVideos - 1) {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * totalVideos);
    } while (nextIndex === currentIndex);
    return nextIndex;
  }
  
  // Otherwise, pick any that's not in the avoid list
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * totalVideos);
  } while (indicesToAvoid.includes(nextIndex));
  
  return nextIndex;
};
