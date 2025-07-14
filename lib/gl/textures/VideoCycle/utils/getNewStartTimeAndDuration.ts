import { lc, log } from '@lib/logger/index.ts'

/**
 * Calculates a new start time and duration for a video segment, ensuring it fits within specified length constraints.
 * This is a pure function with no side effects - it only calculates values.
 *
 * @param video - The HTMLVideoElement to analyze.
 * @param minVideoLength - Minimum allowed segment length (in seconds). Default is 1.
 * @param maxVideoLength - Maximum allowed segment length (in seconds). Default is 3.
 * @param marginSeconds - Margin (in seconds) to avoid trimming too close to the video edges. Default is 0.1.
 * @returns An object containing the start time and duration for the new segment.
 */
export const getNewStartTimeAndDuration = (
  video: HTMLVideoElement,
  minSegmentLength: number = 1,
  maxSegmentLength: number = 3,
  marginSeconds = 0.1,
): { startTime: number; duration: number } => {
  if (isNaN(video.duration) || video.duration <= 0) {
    log.warn(lc.GL_VIDEO, 'Cannot calculate segment: video duration is not available')
    return { startTime: 0, duration: video.duration || 0 }
  }

  const earliestStartTime = marginSeconds
  const latestStartTime = video.duration - marginSeconds - minSegmentLength
  const maxDurationTime = video.duration - marginSeconds * 2

  const startTime = Math.random() * (latestStartTime - earliestStartTime) + earliestStartTime
  let duration = Math.random() * (maxSegmentLength - minSegmentLength) + minSegmentLength

  if (duration + startTime > latestStartTime) duration = minSegmentLength

  log.group(lc.GL_VIDEO, 'getNewStartTimeAndDuration')
  log.debug(lc.GL_VIDEO, 'video.duration', video.duration)
  log.debug(lc.GL_VIDEO, 'earliestStartTime', earliestStartTime)
  log.debug(lc.GL_VIDEO, 'minSegmentLength', minSegmentLength)
  log.debug(lc.GL_VIDEO, 'maxSegmentLength', maxSegmentLength)
  log.debug(lc.GL_VIDEO, 'maxDurationTime', maxDurationTime)
  log.debug(lc.GL_VIDEO, 'latestStartTime', latestStartTime)
  log.groupEnd()

  log.debug(lc.GL_VIDEO, 'generated duration', duration)
  log.debug(lc.GL_VIDEO, 'generated startTime', startTime)

  // If even the minimum length can't fit, return whatever could work
  if (maxDurationTime < minSegmentLength) {
    log.debug(lc.GL_VIDEO, 'maxDurationTime < minSegmentLength', maxDurationTime, minSegmentLength)
    return { startTime: marginSeconds, duration: maxDurationTime }
  }

  // Ensure we have a valid start time range
  if (latestStartTime < earliestStartTime) {
    log.warn(lc.GL_VIDEO, `Invalid time range: duration ${duration.toFixed(2)}s too long for video ${video.duration.toFixed(2)}s`)
    return { startTime: 0, duration: Math.max(0, video.duration - marginSeconds * 2) }
  }

  const segmentEnd = startTime + duration

  // Final validation: ensure segment doesn't exceed video bounds
  if (segmentEnd > video.duration - marginSeconds) {
    log.warn(
      lc.GL_VIDEO,
      `Segment validation failed: ${startTime.toFixed(2)}s + ${duration.toFixed(2)}s = ${segmentEnd.toFixed(2)}s > ${
        (video.duration - marginSeconds).toFixed(2)
      }s`,
    )
    // Fix the duration to fit
    const safeDuration = Math.max(minSegmentLength, video.duration - startTime - marginSeconds)
    log.debug(lc.GL_VIDEO, `Corrected to safe duration: ${safeDuration.toFixed(2)}s`)
    return { startTime, duration: safeDuration }
  }

  log.debug(lc.GL_VIDEO, `Calculated segment: ${startTime.toFixed(2)}s for ${duration.toFixed(2)}s`)
  return { startTime, duration }
}
