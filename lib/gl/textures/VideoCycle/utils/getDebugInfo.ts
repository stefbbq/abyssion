import type { PlaybackState, VideoCycleDebugInfo } from '../types.ts'
import type { VideoPool } from './updateVideoPool.ts'

/**
 * @description
 * @description
 * This function returns debug info for the video cycle
 *
 * @returns {VideoDebugInfo}
 */
export const getDebugInfo = (playbackState: PlaybackState, videoPool: VideoPool, nextVideoIndex: number): VideoCycleDebugInfo => {
  const {
    currentManifestIndex,
    recentIndices,
    timeSinceSwitch,
    currentDuration,
    currentStartTime,
    isPlaying,
    isNextVideoPrepared,
  } = playbackState

  const activeVideo = currentManifestIndex !== -1 ? videoPool.videos[currentManifestIndex] : null
  const currentVideoName = activeVideo?.src?.split('/').pop() || 'Unknown'

  let nextPreparedVideoName = null
  if (isNextVideoPrepared) {
    const nextVideo = videoPool?.videos[nextVideoIndex]
    nextPreparedVideoName = nextVideo?.src?.split('/').pop() ?? null
  }

  return {
    isPlaying: isPlaying || false,
    currentVideoIndex: currentManifestIndex ?? -1,
    currentVideoName,
    currentVideoSrc: activeVideo?.src || '',
    timeSinceSwitch: timeSinceSwitch || 0,
    currentDuration: currentDuration || 0,
    fullVideoDuration: activeVideo?.duration || 0,
    videoStartTime: currentStartTime || 0,
    totalVideos: videoPool.manifest.length || 0,
    recentIndices: recentIndices || [],
    nextPreparedIndex: isNextVideoPrepared ? nextVideoIndex : null,
    nextPreparedVideoName,
    loadingProgress: {
      loaded: 3, // always 3 video elements in pool
      total: videoPool.manifest.length || 0,
      hasMoreToLoad: false,
    },
  }
}
