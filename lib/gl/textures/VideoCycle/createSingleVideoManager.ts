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
  // try preferred source, then fallback to alternate container if initial play fails
  const pickAlternate = (src: string) => src.endsWith('.mp4') ? src.replace(/\.mp4$/, '.webm') : src.replace(/\.webm$/, '.mp4')
  let currentSrc = singleVideoPath
  // lazy-loaded hls.js instance for .m3u8 streams
  type HlsPublic = { destroy: () => void; attachMedia: (media: HTMLVideoElement) => void; loadSource: (url: string) => void }
  type HlsWithLevels = HlsPublic & {
    currentLevel?: number
    nextLevel?: number
    autoLevelEnabled?: boolean
    levels?: Array<{ bitrate: number; width?: number; height?: number }>
  }
  type HlsClass = typeof import('hls.js').default
  let hlsInstance: HlsPublic | null = null

  // set video source with support for hls (.m3u8) using native safari support or hls.js esm fallback
  const setVideoSource = async (): Promise<void> => {
    const isHls = /\.m3u8(\?|$)/.test(currentSrc)
    if (!isHls) {
      video.src = currentSrc
      return
    }

    const canUseNativeHls = video.canPlayType('application/vnd.apple.mpegurl') !== ''
    if (canUseNativeHls) {
      video.src = currentSrc
      return
    }

    try {
      // dynamic import of npm module via deno import map
      const mod = await import('hls.js')
      const Hls = (mod as unknown as { default: HlsClass }).default
      if (!Hls || !Hls.isSupported()) {
        log.error(lc.GL_VIDEO, 'hls.js not supported and no native hls available')
        return
      }

      type HlsConfig = import('hls.js').HlsConfig
      // start with the lowest available level for a quick first frame, then we will switch to auto
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        startLevel: 0,
        capLevelToPlayerSize: true,
        // encourage faster ramp-up
        abrMaxWithRealBitrate: true,
        maxBufferLength: 5,
      } as HlsConfig) as unknown as HlsPublic
      hlsInstance.attachMedia(video)
      hlsInstance.loadSource(currentSrc)
      // rely on existing 'canplay' readiness; no need to wait for Hls.Events
    } catch (e) {
      log.error(lc.GL_VIDEO, 'failed to initialize hls.js', e)
    }
  }

  await setVideoSource()

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
    // after initial playback starts, ramp to higher quality quickly
    if (hlsInstance) {
      const hls = hlsInstance as HlsWithLevels
      const bumpQuality = () => {
        try {
          // push to the highest available level immediately, then enable ABR
          if (Array.isArray(hls.levels) && hls.levels.length > 0 && typeof hls.nextLevel !== 'undefined') {
            hls.nextLevel = Math.max(0, hls.levels.length - 1)
          }
          if (typeof hls.autoLevelEnabled === 'boolean') hls.autoLevelEnabled = true
          if (typeof hls.currentLevel === 'number') hls.currentLevel = -1 // -1 enables ABR
          log.debug(lc.GL_VIDEO, 'Requested rapid quality ramp-up and enabled auto level')
        } catch (e) {
          log.debug(lc.GL_VIDEO, 'Failed to bump HLS quality (non-fatal)', e)
        }
      }

      if (!video.paused) {
        setTimeout(bumpQuality, 300)
      } else {
        const once = () => {
          video.removeEventListener('playing', once)
          setTimeout(bumpQuality, 300)
        }
        video.addEventListener('playing', once)
      }
    }
  } catch (error) {
    // attempt fallback container once
    const alt = pickAlternate(currentSrc)
    if (alt !== currentSrc) {
      log.warn(lc.GL_VIDEO, `Primary failed, trying fallback source: ${alt}`)
      try {
        video.pause() // fully reset element and source (including hls instance) before retry
        ;(hlsInstance as unknown as { destroy?: () => void }).destroy?.()
        hlsInstance = null
        video.src = ''
        video.load()
        currentSrc = alt
        await setVideoSource()
        await video.play()
        log.debug(lc.GL_VIDEO, 'Fallback video playing successfully')
      } catch (fallbackError) {
        log.error(lc.GL_VIDEO, 'Failed to play fallback single video:', fallbackError)
        throw fallbackError
      }
    } else {
      log.error(lc.GL_VIDEO, 'Failed to play single video and no fallback available:', error)
      throw error
    }
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
      ;(hlsInstance as unknown as { destroy?: () => void }).destroy?.()
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
