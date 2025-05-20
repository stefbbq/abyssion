/**
 * Check if a video is ready for playback
 * @param video HTML Video Element to check
 * @returns Boolean indicating if video is ready
 */
export const isVideoReady = (video: HTMLVideoElement): boolean => {
  return (
    video &&
    video.readyState >= 3 && // HAVE_FUTURE_DATA or higher
    !isNaN(video.duration)
  );
};
