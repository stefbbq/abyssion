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
    if (!video.duration || isNaN(video.duration) || video.duration === Infinity) {
      console.warn('Cannot seek: video duration is not available')
      resolve({ startTime: 0, duration: 0 })
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

    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked)
      console.log(`✅ Video seeked successfully to ${video.currentTime.toFixed(2)}s (requested ${startTime.toFixed(2)}s)`)
      resolve({ startTime, duration })
    }

    video.addEventListener('seeked', onSeeked)

    try {
      // Pause the video before seeking to ensure clean state
      video.pause()
      console.log(`🎯 Seeking video to ${startTime.toFixed(2)}s (duration: ${video.duration.toFixed(2)}s, readyState: ${video.readyState})`)
      video.currentTime = startTime
    } catch (error) {
      console.error('Error seeking to random position:', error)
      video.removeEventListener('seeked', onSeeked)
      reject(error)
    }
  })
}
