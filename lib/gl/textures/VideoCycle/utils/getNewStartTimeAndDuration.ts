import { lc, log } from '../../../../logger/index.ts'

/**
 * Calculates a new start time and duration for a video segment, ensuring it fits within specified length constraints.
 *
 * @param video - The HTMLVideoElement to analyze.
 * @param minVideoLength - Minimum allowed segment length (in seconds). Default is 1.
 * @param maxVideoLength - Maximum allowed segment length (in seconds). Default is 3.
 * @param marginSeconds - Margin (in seconds) to avoid trimming too close to the video edges. Default is 0.1.
 * @returns An object containing the start time and duration for the new segment.
 */
export const getNewStartTimeAndDuration = (
  video: HTMLVideoElement,
  minVideoLength: number = 1,
  maxVideoLength: number = 3,
  marginSeconds = 0.1,
): Promise<{ startTime: number; duration: number }> => {
  return new Promise<{ startTime: number; duration: number }>((resolve, reject) => {
    if (isNaN(video.duration) || video.duration <= 0) {
      log.warn(lc.GL_VIDEO, 'Cannot seek: video duration is not available')
      resolve({ startTime: 0, duration: video.duration || 0 })
      return
    }

    const earliestStartTime = marginSeconds

    // Ensure the chosen segment length is always within [minVideoLength, maxVideoLength]
    const maxAllowedDuration = Math.min(maxVideoLength, video.duration - earliestStartTime * 2)

    // If even the minimum length can't fit, bail early
    if (maxAllowedDuration < minVideoLength) {
      resolve({ startTime: 0, duration: 0 })
      return
    }

    const duration = minVideoLength + Math.random() * (maxAllowedDuration - minVideoLength)
    const latestStartTime = video.duration - duration - marginSeconds
    const startTime = earliestStartTime + Math.random() * (latestStartTime - earliestStartTime)

    let timeoutId: number

    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked)
      clearTimeout(timeoutId)
      resolve({ startTime, duration })
    }

    // Add timeout to prevent hanging
    timeoutId = setTimeout(() => {
      video.removeEventListener('seeked', onSeeked)
      log.warn(lc.GL_VIDEO, 'Video seek timeout after 3s, resolving anyway')
      resolve({ startTime, duration })
    }, 3000)

    video.addEventListener('seeked', onSeeked)

    try {
      // Pause the video before seeking to ensure clean state
      video.pause()
      video.currentTime = startTime
    } catch (error) {
      log.error(lc.GL_VIDEO, 'Error seeking to random position:', error)
      video.removeEventListener('seeked', onSeeked)
      clearTimeout(timeoutId)
      reject(error)
    }
  })
}
