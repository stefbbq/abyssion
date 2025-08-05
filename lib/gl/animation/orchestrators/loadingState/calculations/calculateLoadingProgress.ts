/**
 * Loading progress calculation parameters
 */
type LoadingProgressParams = {
  readonly startTime: number
  readonly currentTime: number
  readonly isVideoReady: boolean
  readonly minimumLoadingTime: number
}

/**
 * Loading progress calculation result
 */
type LoadingProgressResult = {
  readonly progress: number // 0 to 1
  readonly isComplete: boolean
  readonly elapsedTime: number
}

/**
 * Calculates loading progress based on time elapsed and video readiness
 * Ensures minimum loading time for smooth UX even if video loads quickly
 */
export const calculateLoadingProgress = (params: LoadingProgressParams): LoadingProgressResult => {
  const { startTime, currentTime, isVideoReady, minimumLoadingTime } = params

  const elapsedTime = currentTime - startTime
  const timeProgress = Math.min(elapsedTime / minimumLoadingTime, 1.0)

  // Progress is based on both time elapsed and video readiness
  // Show progress up to 90% while waiting for video, then complete when video is ready
  const progress = isVideoReady ? 1.0 : Math.min(timeProgress * 0.9, 0.9)
  const isComplete = isVideoReady && elapsedTime >= minimumLoadingTime

  return {
    progress,
    isComplete,
    elapsedTime,
  }
}
