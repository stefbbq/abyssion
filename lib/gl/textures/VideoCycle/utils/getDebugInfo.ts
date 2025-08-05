import type { BufferObject, PlaybackState, VideoCycleDebugInfo } from '../types.ts'
import type { VideoPool } from './updateVideoPool.ts'

/**
 * @description
 * This function returns comprehensive debug info for the video cycle
 *
 * @returns {VideoCycleDebugInfo}
 */
export const getDebugInfo = (
  playbackState: PlaybackState,
  videoPool: VideoPool,
  nextVideoIndex: number,
  nextVideoStartTime: number,
  bufferSwapTime: number,
  activeBuffer: BufferObject,
  hiddenBuffer: BufferObject,
  frontBuffer: BufferObject,
  _backBuffer: BufferObject,
  _antiRepeat: number,
): VideoCycleDebugInfo => {
  const {
    currentManifestIndex,
    recentIndices,
    timeSinceSwitch,
    currentDuration,
    currentStartTime,
    isPlaying,
    isNextVideoPrepared,
  } = playbackState

  const currentTime = new Date().getTime()

  // Current video information
  const activeVideo = currentManifestIndex !== -1 ? videoPool.videos[currentManifestIndex] : null
  const currentVideoName = activeVideo?.src?.split('/').pop() || 'Unknown'
  const currentSegmentEndTime = currentStartTime + currentDuration
  const segmentProgressPercent = currentDuration > 0 ? (timeSinceSwitch / 1000) / currentDuration * 100 : 0

  // Next video information
  const nextVideo = nextVideoIndex !== undefined && videoPool.videos[nextVideoIndex] ? videoPool.videos[nextVideoIndex] : null
  const nextVideoName = nextVideo?.src?.split('/').pop() || null

  // Timing calculations
  const timeUntilNextVideo = Math.max(0, nextVideoStartTime - currentTime)
  const timeUntilBufferSwap = Math.max(0, bufferSwapTime - currentTime)

  // Buffer states
  const getBufferInfo = (buffer: BufferObject, name: string) => {
    const opacity = buffer.material?.uniforms?.opacity?.value || 0
    // Try to determine which video is in this buffer by checking if it matches active or next
    let videoIndex = null
    let videoName = null

    if (buffer === activeBuffer && isPlaying) {
      videoIndex = currentManifestIndex
      videoName = currentVideoName
    } else if (buffer === hiddenBuffer && isNextVideoPrepared) {
      videoIndex = nextVideoIndex
      videoName = nextVideoName
    }

    return {
      name,
      opacity,
      videoIndex,
      videoName,
    }
  }

  const activeBufferInfo = getBufferInfo(
    activeBuffer,
    activeBuffer === frontBuffer ? 'front' : 'back',
  )
  const hiddenBufferInfo = getBufferInfo(
    hiddenBuffer,
    hiddenBuffer === frontBuffer ? 'front' : 'back',
  )

  // Anti-repeat calculations
  const antiRepeatCount = recentIndices.filter((index) => index !== currentManifestIndex).length

  return {
    // Basic state
    isPlaying: isPlaying || false,
    isTransitioning: false, // add transition tracking in the future if needed

    // Current video information
    currentVideoIndex: currentManifestIndex ?? -1,
    currentVideoName,
    currentVideoSrc: activeVideo?.src || '',
    currentDuration: currentDuration || 0,
    currentStartTime: currentStartTime || 0,
    currentSegmentEndTime,
    fullVideoDuration: activeVideo?.duration || 0,

    // Timing information
    timeSinceSwitch: timeSinceSwitch || 0,
    segmentProgressPercent: Math.max(0, Math.min(100, segmentProgressPercent)),
    nextVideoTriggerTime: nextVideoStartTime,
    timeUntilNextVideo,
    bufferSwapTime,
    timeUntilBufferSwap,

    // Next video information
    nextPreparedIndex: isNextVideoPrepared ? nextVideoIndex : null,
    nextPreparedVideoName: nextVideoName,
    nextPreparedVideoSrc: nextVideo?.src || null,
    nextVideoStartTime: isNextVideoPrepared ? currentStartTime : null, // This would need to be passed from main cycle
    nextVideoDuration: isNextVideoPrepared ? currentDuration : null, // This would need to be calculated for next video
    nextVideoFullDuration: nextVideo?.duration || null,

    // History and anti-repeat
    recentIndices: recentIndices || [],
    antiRepeatCount,

    // Buffer states
    activeBuffer: activeBufferInfo,
    hiddenBuffer: hiddenBufferInfo,

    // Pool and loading information
    totalVideos: (videoPool.manifest?.length || 0) + (videoPool.videos?.length || 0),
    poolSize: videoPool.videos?.length || 0,
    manifestRemaining: videoPool.manifest?.length || 0,
    loadingProgress: {
      loaded: videoPool.videos?.length || 0,
      total: (videoPool.manifest?.length || 0) + (videoPool.videos?.length || 0),
      hasMoreToLoad: (videoPool.manifest?.length || 0) > 0,
    },
  }
}
