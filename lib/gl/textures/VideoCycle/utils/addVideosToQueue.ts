import type { VideoTexture } from '../VideoCycle.d.ts'

/**
 * Adds new videos to the existing queue immutably
 *
 * @example
 * const newQueue = addVideosToQueue(currentVideos, newVideos)
 */
export const addVideosToQueue = (
  current: VideoTexture[],
  newVideos: VideoTexture[],
): VideoTexture[] => [...current, ...newVideos]
