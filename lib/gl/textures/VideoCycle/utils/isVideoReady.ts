/**
 * Checks if a video element is ready for playback
 *
 * A video is considered ready when:
 * - The element exists
 * - Has loaded enough data to play (readyState >= 3)
 * - Has a valid duration
 * - Has valid video dimensions
 */
export const isVideoReady = (video: HTMLVideoElement): boolean => {
  return (
    video &&
    video.readyState >= 3 &&
    !isNaN(video.duration) &&
    video.videoWidth > 0
  )
}
