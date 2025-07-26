import { lc, log } from '@lib/logger/index.ts'

/**
 * @description
 * Validates that all videos are loaded
 *
 * @param videos the videos to validate
 * @returns true if all videos are loaded, false otherwise
 */
export const validateAreVideosLoaded = (videos: readonly HTMLVideoElement[]): boolean => {
  if (videos.length === 0) {
    log.warn(lc.GL_VIDEO, 'No videos to validate')
    return false
  }

  return videos.every((video) => video.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA)
}
