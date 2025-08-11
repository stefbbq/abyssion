import * as THREE from 'three'

import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfigRaw from '@libgl/configVideoCycle.json' with { type: 'json' }
import type { VideoCycleConfig } from '@libgl/configVideoCycle.types.ts'
import type { BufferObject, VideoBackgroundManager, VideoCycleDebugInfo } from './types.ts'

const videoCycleConfig = videoCycleConfigRaw as unknown as VideoCycleConfig

/**
 * @module VideoCycle
 * @description Creates a single video loop system that plays one video on repeat
 * @example
 * Usage:
 *   import { createSingleVideoManager } from '@libgl/textures/VideoCycle/createSingleVideoManager.ts'
 *   const singleVideoManager = createSingleVideoManager(frontBuffer, backBuffer)
 *   singleVideoManager.update()
 *   singleVideoManager.dispose()
 *   singleVideoManager.getDebugInfo()
 *   singleVideoManager.handleResize()
 */
export const createSingleVideoManager = async (
  frontBuffer: BufferObject,
  _backBuffer: BufferObject,
  onReadyToStream?: () => void,
): Promise<VideoBackgroundManager> => {
  const {
    single: { path: singleVideoPath, playbackSpeed: singlePlaybackSpeed, videoLoadTimeoutMS: singleVideoLoadTimeoutMS },
    appearance: { opacity },
  } = videoCycleConfig

  // Create video element
  const video = document.createElement('video')
  video.autoplay = false
  video.loop = true
  video.muted = true
  video.crossOrigin = 'anonymous'
  video.playsInline = true
  // Safari/iOS hints for inline, local decode, and smoother playback
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', '')
  ;(video as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true
  video.preload = 'auto'
  video.playbackRate = singlePlaybackSpeed
  video.src = singleVideoPath

  // Create texture
  const texture = new THREE.VideoTexture(video)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.format = THREE.RGBAFormat
  texture.generateMipmaps = false

  // Update buffer material
  frontBuffer.material.uniforms.videoTexture.value = texture
  frontBuffer.material.uniforms.opacity.value = opacity
  frontBuffer.material.needsUpdate = true

  // Set up ready callback with flag to prevent duplicate calls
  let hasCalledReady = false
  const timeoutId = setTimeout(() => {
    log.warn(lc.GL_VIDEO, `Single video loading timeout: ${singleVideoPath}`)
  }, singleVideoLoadTimeoutMS)

  const handleReady = () => {
    if (hasCalledReady) return // prevent duplicate calls
    hasCalledReady = true

    clearTimeout(timeoutId)
    video.removeEventListener('canplay', handleReady)
    video.removeEventListener('error', handleError)

    log.debug(lc.GL_VIDEO, `Video ready to stream: ${singleVideoPath}`)
    onReadyToStream?.()
  }

  const handleError = (event: Event) => {
    clearTimeout(timeoutId)
    video.removeEventListener('canplay', handleReady)
    video.removeEventListener('error', handleError)
    log.error(lc.GL_VIDEO, `Single video loading error: ${singleVideoPath}`, event)
  }

  video.addEventListener('canplay', handleReady)
  video.addEventListener('error', handleError)

  // Start loading and playing
  video.load()

  try {
    await video.play()
    log.debug(lc.GL_VIDEO, 'Single video playing successfully')
  } catch (error) {
    log.error(lc.GL_VIDEO, 'Failed to play single video:', error)
    throw error
  }

  // Drive texture updates using requestVideoFrameCallback if available (Safari/WebKit friendly)
  const startVideoTextureUpdates = () => {
    const v = video as HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number
      cancelVideoFrameCallback?: (handle: number) => void
    }
    if (typeof v.requestVideoFrameCallback === 'function') {
      let handle = v.requestVideoFrameCallback(() => {})
      const onVideoFrame = () => {
        texture.needsUpdate = true
        if (!video.paused && !video.ended && v.requestVideoFrameCallback) handle = v.requestVideoFrameCallback(onVideoFrame)
      }
      if (v.cancelVideoFrameCallback && handle) v.cancelVideoFrameCallback(handle)
      handle = v.requestVideoFrameCallback(onVideoFrame)
      return () => v.cancelVideoFrameCallback && handle && v.cancelVideoFrameCallback(handle)
    } else {
      let rafId = 0
      const tick = () => {
        texture.needsUpdate = true
        if (!video.paused && !video.ended) rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(rafId)
    }
  }

  const stopVideoTextureUpdates = startVideoTextureUpdates()

  // Check if already ready to play
  if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
    handleReady()
  }

  log.debug(lc.GL_VIDEO, `Single video manager created: ${singleVideoPath}`)

  return {
    update: () => {},
    dispose: () => {
      video.pause()
      video.src = ''
      video.load()
      stopVideoTextureUpdates()
      texture.dispose()
    },
    mesh: frontBuffer.mesh,
    handleResize: () => {},
    getDebugInfo: (): VideoCycleDebugInfo => ({
      // Basic playback state
      isPlaying: !video.paused,
      isTransitioning: false, // Single video never transitions

      // Current video information
      currentVideoIndex: 0,
      currentVideoName: singleVideoPath.split('/').pop() || 'unknown',
      currentVideoSrc: singleVideoPath,
      currentDuration: video.duration || 0,
      currentStartTime: 0,
      currentSegmentEndTime: video.duration || 0,
      fullVideoDuration: video.duration || 0,

      // Timing information
      timeSinceSwitch: 0, // No switching in single mode
      segmentProgressPercent: video.duration ? (video.currentTime / video.duration) * 100 : 0,
      nextVideoTriggerTime: 0,
      timeUntilNextVideo: 0,
      bufferSwapTime: 0,
      timeUntilBufferSwap: 0,

      // Next video information (none for single mode)
      nextPreparedIndex: null,
      nextPreparedVideoName: null,
      nextPreparedVideoSrc: null,
      nextVideoStartTime: null,
      nextVideoDuration: null,
      nextVideoFullDuration: null,

      // History and anti-repeat (not applicable)
      recentIndices: [],
      antiRepeatCount: 0,

      // Buffer states
      activeBuffer: {
        name: 'front',
        opacity: opacity,
        videoIndex: 0,
        videoName: singleVideoPath.split('/').pop() || 'unknown',
      },
      hiddenBuffer: {
        name: 'back',
        opacity: 0,
        videoIndex: null,
        videoName: null,
      },

      // Pool and loading information
      totalVideos: 1,
      loadingProgress: {
        loaded: 1,
        total: 1,
        hasMoreToLoad: false,
      },
      poolSize: 1,
      manifestRemaining: 0,
    }),
  }
}
