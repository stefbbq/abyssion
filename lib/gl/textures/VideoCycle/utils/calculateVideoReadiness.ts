import type { ReadinessInput, ReadinessState } from '../types.ts'

/**
 * Calculates video readiness state to determine when system is ready for playback
 * 
 * This pure function determines when the video system has loaded enough videos
 * to begin playback and transitions. It tracks loading progress and identifies
 * the next video that should be loaded to maintain smooth operation.
 * 
 * @param input - Readiness calculation parameters including loaded videos and requirements
 * @returns Readiness state with playback capability and next loading actions
 * 
 * @example
 * const readiness = calculateVideoReadiness({
 *   loadedVideos: [
 *     { index: 0, filename: 'video1.mp4', url: '/videos/video1.mp4', loaded: true, duration: 30, element: videoEl1 },
 *     { index: 1, filename: 'video2.mp4', url: '/videos/video2.mp4', loaded: true, duration: 25, element: videoEl2 },
 *     { index: 2, filename: 'video3.mp4', url: '/videos/video3.mp4', loaded: false, duration: 0, element: null }
 *   ],
 *   minimumVideosRequired: 2,
 *   currentlyLoading: ['video3.mp4']
 * })
 * // Returns: { isReadyForPlayback: true, canStartTransitions: true, nextVideoToLoad: null, loadingProgress: 0.67 }
 */
export const calculateVideoReadiness = (input: ReadinessInput): ReadinessState => {
  const {
    loadedVideos,
    minimumVideosRequired,
    currentlyLoading
  } = input

  // Count successfully loaded videos
  const loadedCount = loadedVideos.filter(video => video.loaded).length
  const totalVideos = loadedVideos.length

  // Calculate loading progress (0-1)
  const loadingProgress = totalVideos === 0 ? 0 : loadedCount / totalVideos

  // Determine if ready for initial playback
  const isReadyForPlayback = loadedCount >= minimumVideosRequired

  // Determine if ready for smooth transitions (need at least 2 loaded videos)
  const canStartTransitions = loadedCount >= Math.max(2, minimumVideosRequired)

  // Find next video to load
  let nextVideoToLoad: string | null = null

  // Only suggest next video if we're not already loading too many
  if (currentlyLoading.length < 2) {
    // Find first unloaded video that's not currently being loaded
    const currentlyLoadingSet = new Set(currentlyLoading)
    
    for (const video of loadedVideos) {
      if (!video.loaded && !currentlyLoadingSet.has(video.filename)) {
        nextVideoToLoad = video.filename
        break
      }
    }
  }

  return {
    isReadyForPlayback,
    canStartTransitions,
    nextVideoToLoad,
    loadingProgress
  }
}