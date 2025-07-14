// the video readiness state
type VideoReadinessState = {
  // whether video has enough data to play
  readonly isReady: boolean
  // video ready state value
  readonly readyState: number
  // whether video has valid duration
  readonly hasValidDuration: boolean
  // whether video has valid dimensions
  readonly hasValidDimensions: boolean
  // current time position
  readonly currentTime: number
  // video duration
  readonly duration: number
  // video dimensions
  readonly dimensions: { width: number; height: number }
}

// the result of calculating video readiness
type VideoReadinessResult = {
  // the calculated readiness state
  readonly readinessState: VideoReadinessState
  // whether video is ready for playback
  readonly canPlay: boolean
  // whether video is ready for seeking
  readonly canSeek: boolean
  // whether video is fully loaded
  readonly isFullyLoaded: boolean
}

/**
 * Calculates video readiness state for safe playback operations
 *
 * Pure function that determines if video is ready for various operations
 */
export const calculateVideoReadiness = (video: HTMLVideoElement): VideoReadinessResult => {
  const readinessState: VideoReadinessState = {
    isReady: video.readyState >= 3, // HAVE_FUTURE_DATA
    readyState: video.readyState,
    hasValidDuration: !isNaN(video.duration) && video.duration > 0,
    hasValidDimensions: video.videoWidth > 0 && video.videoHeight > 0,
    currentTime: video.currentTime,
    duration: video.duration || 0,
    dimensions: {
      width: video.videoWidth,
      height: video.videoHeight,
    },
  }

  const canPlay = readinessState.isReady &&
    readinessState.hasValidDuration &&
    readinessState.hasValidDimensions

  const canSeek = readinessState.readyState >= 2 && // HAVE_CURRENT_DATA
    readinessState.hasValidDuration

  const isFullyLoaded = readinessState.readyState === 4 // HAVE_ENOUGH_DATA

  return {
    readinessState,
    canPlay,
    canSeek,
    isFullyLoaded,
  }
}

/**
 * Calculates if video is ready for immediate playback without delays
 *
 * Stricter readiness check for smooth video transitions
 */
export const calculateImmediatePlaybackReadiness = (video: HTMLVideoElement): boolean => {
  const { canPlay, isFullyLoaded } = calculateVideoReadiness(video)
  return canPlay && isFullyLoaded
}

/**
 * Calculates wait time needed for video to become ready
 *
 * Returns estimated wait time in milliseconds
 */
export const calculateVideoWaitTime = (video: HTMLVideoElement): number => {
  const { readinessState } = calculateVideoReadiness(video)

  if (readinessState.isReady) return 0

  // estimate based on ready state
  switch (readinessState.readyState) {
    case 0:
      return 2000 // HAVE_NOTHING
    case 1:
      return 1500 // HAVE_METADATA
    case 2:
      return 1000 // HAVE_CURRENT_DATA
    case 3:
      return 500 // HAVE_FUTURE_DATA
    default:
      return 0
  }
}
