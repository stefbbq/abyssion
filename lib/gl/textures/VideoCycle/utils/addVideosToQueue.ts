import type { VideoTexture } from '@libgl/textures/VideoCycle/types.ts'

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
