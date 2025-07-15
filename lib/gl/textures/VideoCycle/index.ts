import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfig from '@libgl/configVideoCycle.json' with { type: 'json' }
import * as Three from 'three'
import { calculateNextVideoSource } from './utils/calculateNextVideoSource.ts'
import { calculateBufferState, calculatePreparationTiming } from './utils/calculateBufferState.ts'
import { getNewStartTimeAndDuration } from './utils/getNewStartTimeAndDuration.ts'
import type { VideoBackgroundManager } from '@libgl/types.ts'
import type { BufferObject, PlaybackState, VideoManifest, VideoPool } from './types.ts'
import ms from 'ms'

/**
 * Creates an efficient video cycle system with 2-3 video elements maximum
 *
 * Uses pure utility functions for calculations and keeps Three.js mutations isolated
 */
export const createVideoCycle = (
  frontBuffer: BufferObject,
  backBuffer: BufferObject,
): VideoBackgroundManager => {
  const {
    enabled,
    cycling: { minSegmentLength, maxSegmentLength, antiRepeat },
    appearance: { opacity },
    videos: { path: videosPath },
  } = videoCycleConfig

  // Timeout values - TODO: add to config
  const videoSwapTimeoutMs = 3000
  const videoLoadTimeoutMs = 10000

  // Create video pool with 3 elements for efficient memory usage
  const createVideoPool = (): VideoPool => {
    const videos = Array.from({ length: 3 }, () => {
      const video = document.createElement('video')
      video.autoplay = false
      video.loop = true
      video.muted = true
      video.crossOrigin = 'anonymous'
      video.playsInline = true
      video.preload = 'auto'
      video.playbackRate = videoCycleConfig.cycling.playbackSpeed
      return video
    })

    const textures = videos.map((video) => {
      const texture = new Three.VideoTexture(video)
      texture.minFilter = Three.LinearFilter
      texture.magFilter = Three.LinearFilter
      texture.format = Three.RGBAFormat
      return texture
    })

    return {
      videos,
      textures,
      activeIndex: 0,
      nextIndex: 1,
      backupIndex: 2,
    }
  }

  // Load video manifest
  const loadManifest = async (): Promise<VideoManifest> => {
    try {
      const manifestPath = `${videosPath}manifest.json`
      const response = await fetch(manifestPath)

      if (!response.ok) {
        throw new Error(`Failed to fetch manifest: ${response.status}`)
      }

      const manifestData = await response.json()
      const files = Array.isArray(manifestData) ? manifestData.filter((file) => typeof file === 'string') : []

      return {
        files,
        basePath: videosPath,
        totalCount: files.length,
      }
    } catch (error) {
      log.error(lc.GL_VIDEO, 'Error loading video manifest:', error)
      return { files: [], basePath: videosPath, totalCount: 0 }
    }
  }

  // Load video source directly into video element
  const loadVideoIntoElement = async (
    video: HTMLVideoElement,
    videoPath: string,
    timeout: number = videoLoadTimeoutMs,
  ): Promise<boolean> => {
    try {
      log.debug(lc.GL_VIDEO, `Loading video source: ${videoPath}`)

      // Configure video element
      video.autoplay = false
      video.loop = true
      video.muted = true
      video.crossOrigin = 'anonymous'
      video.playsInline = true
      video.preload = 'auto'
      video.playbackRate = videoCycleConfig.cycling.playbackSpeed

      // Set the source directly
      video.src = videoPath
      video.load()

      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          cleanup()
          reject(new Error('Video load timeout'))
        }, timeout)

        const handleCanPlay = () => {
          cleanup()
          log.trace(lc.GL_VIDEO, `Video ready: ${videoPath}`)
          resolve()
        }

        const handleError = (event: Event) => {
          cleanup()
          reject(new Error(`Video load error: ${event.type}`))
        }

        const cleanup = () => {
          clearTimeout(timeoutId)
          video.removeEventListener('canplay', handleCanPlay)
          video.removeEventListener('error', handleError)
        }

        video.addEventListener('canplay', handleCanPlay)
        video.addEventListener('error', handleError)
      })

      log.debug(lc.GL_VIDEO, `Successfully loaded video source: ${videoPath}`)
      return true
    } catch (error) {
      log.error(lc.GL_VIDEO, `Failed to load video source: ${videoPath}`, error)
      return false
    }
  }

  // Play video with timeout protection
  const playVideoSafely = async (
    video: HTMLVideoElement,
    timeout: number = videoSwapTimeoutMs,
  ): Promise<boolean> => {
    try {
      await Promise.race([
        video.play(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Video play timeout')), timeout)),
      ])
      return true
    } catch (error) {
      log.error(lc.GL_VIDEO, 'Failed to play video:', error)
      return false
    }
  }

  // Seek video to specific time and wait for completion
  const seekVideoSafely = async (
    video: HTMLVideoElement,
    targetTime: number,
    timeout: number = 2000,
  ): Promise<boolean> => {
    try {
      log.debug(lc.GL_VIDEO, `Seeking to ${targetTime.toFixed(2)}s (current: ${video.currentTime.toFixed(2)}s)`)

      // If already at target time (within 0.1s), no need to seek
      if (Math.abs(video.currentTime - targetTime) < 0.1) {
        log.trace(lc.GL_VIDEO, `Already at target time ${targetTime.toFixed(2)}s`)
        return true
      }

      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          cleanup()
          reject(new Error('Video seek timeout'))
        }, timeout)

        const handleSeeked = () => {
          cleanup()
          log.trace(lc.GL_VIDEO, `Seek completed to ${video.currentTime.toFixed(2)}s`)
          resolve()
        }

        const handleError = (event: Event) => {
          cleanup()
          reject(new Error(`Video seek error: ${event.type}`))
        }

        const cleanup = () => {
          clearTimeout(timeoutId)
          video.removeEventListener('seeked', handleSeeked)
          video.removeEventListener('error', handleError)
        }

        video.addEventListener('seeked', handleSeeked)
        video.addEventListener('error', handleError)

        // Perform the seek
        video.currentTime = targetTime
      })

      return true
    } catch (error) {
      log.error(lc.GL_VIDEO, `Failed to seek video to ${targetTime.toFixed(2)}s:`, error)
      return false
    }
  }

  // Initialize state
  let manifest: VideoManifest = { files: [], basePath: videosPath, totalCount: 0 }
  let videoPool: VideoPool
  let playbackState: PlaybackState
  let activeBuffer: BufferObject = frontBuffer
  let hiddenBuffer: BufferObject = backBuffer
  let isTransitioning = false

  // Initialize the system
  const initialize = async (): Promise<void> => {
    manifest = await loadManifest()

    if (manifest.totalCount === 0) {
      log.error(lc.GL_VIDEO, 'No videos found in manifest')
      return
    }

    videoPool = createVideoPool()

    playbackState = {
      manifest,
      videoPool,
      currentManifestIndex: -1,
      recentIndices: [],
      timeSinceSwitch: 0,
      currentDuration: 0,
      currentStartTime: 0,
      isPlaying: false,
      isNextVideoPrepared: false,
    }

    // Set initial buffer opacity
    activeBuffer.material.opacity = opacity
    activeBuffer.material.needsUpdate = true

    log(lc.GL_TEXTURES, `Video cycle initialized with ${manifest.totalCount} videos`)
  }

  // Start playback with first video
  const startPlayback = async (): Promise<void> => {
    if (playbackState.isPlaying || manifest.totalCount === 0) return

    try {
      isTransitioning = true
      log(lc.GL_TEXTURES, `Starting video playback`)

      // Calculate first video to play
      const firstVideoSource = calculateNextVideoSource({
        currentIndex: -1,
        recentIndices: [],
        manifest: manifest.files,
        basePath: manifest.basePath,
      })

      const activeVideo = videoPool.videos[videoPool.activeIndex]
      const activeTexture = videoPool.textures[videoPool.activeIndex]

      // Load first video
      const loadSuccess = await loadVideoIntoElement(activeVideo, firstVideoSource.videoPath)
      if (!loadSuccess) {
        log.error(lc.GL_VIDEO, 'Failed to load first video')
        isTransitioning = false
        return
      }

      // Calculate segment timing
      const timing = getNewStartTimeAndDuration(
        activeVideo,
        minSegmentLength,
        maxSegmentLength,
      )

      // Seek to start time
      const seekSuccess = await seekVideoSafely(activeVideo, timing.startTime)
      if (!seekSuccess) {
        log.error(lc.GL_VIDEO, 'Failed to seek to start time')
        isTransitioning = false
        return
      }

      // Start playing
      const playSuccess = await playVideoSafely(activeVideo)
      if (!playSuccess) {
        log.error(lc.GL_VIDEO, 'Failed to start video playback')
        isTransitioning = false
        return
      }

      // Verify video started at correct time
      verifyVideoTiming(activeVideo, timing.startTime)

      // Update buffer material
      if ('uniforms' in activeBuffer.material) {
        activeBuffer.material.uniforms.videoTexture.value = activeTexture
        activeBuffer.material.uniforms.opacity.value = opacity
      } else {
        activeBuffer.material.map = activeTexture
        activeBuffer.material.opacity = opacity
      }
      activeBuffer.material.needsUpdate = true

      // Update playback state
      playbackState = {
        ...playbackState,
        currentManifestIndex: firstVideoSource.manifestIndex,
        recentIndices: firstVideoSource.updatedRecentIndices,
        currentDuration: timing.duration,
        currentStartTime: timing.startTime,
        isPlaying: true,
        timeSinceSwitch: 0,
      }

      log.debug(lc.GL_TEXTURES, `Started playback with video ${firstVideoSource.manifestIndex}`)
      isTransitioning = false
    } catch (error) {
      log.error(lc.GL_TEXTURES, 'Error starting playback:', error)
      isTransitioning = false
    }
  }

  // Prepare next video for smooth transition
  const prepareNextVideo = async (): Promise<void> => {
    if (playbackState.isNextVideoPrepared || isTransitioning) {
      log.trace(lc.GL_VIDEO, `Skipping preparation: prepared=${playbackState.isNextVideoPrepared}, transitioning=${isTransitioning}`)
      return
    }

    try {
      log.debug(lc.GL_VIDEO, `Starting next video preparation from manifest index ${playbackState.currentManifestIndex}`)

      const nextVideoSource = calculateNextVideoSource({
        currentIndex: playbackState.currentManifestIndex,
        recentIndices: playbackState.recentIndices,
        manifest: manifest.files,
        basePath: manifest.basePath,
      })

      const nextVideo = videoPool.videos[videoPool.nextIndex]
      log.debug(
        lc.GL_VIDEO,
        `Preparing video ${nextVideoSource.manifestIndex}: ${nextVideoSource.filename} (pool index: ${videoPool.nextIndex})`,
      )

      const loadSuccess = await loadVideoIntoElement(nextVideo, nextVideoSource.videoPath)
      if (!loadSuccess) {
        log.warn(lc.GL_VIDEO, 'Failed to prepare next video')
        return
      }

      // Calculate timing for next video
      const timing = getNewStartTimeAndDuration(
        nextVideo,
        minSegmentLength,
        maxSegmentLength,
      )

      // Seek to start time
      const seekSuccess = await seekVideoSafely(nextVideo, timing.startTime)
      if (!seekSuccess) {
        log.warn(lc.GL_VIDEO, 'Failed to seek next video to start time')
        return
      }
      log.debug(lc.GL_VIDEO, `Set next video start time to ${timing.startTime.toFixed(2)}s (duration: ${timing.duration.toFixed(2)}s)`)

      // Start playing but keep hidden
      const playSuccess = await playVideoSafely(nextVideo)
      if (!playSuccess) {
        log.warn(lc.GL_VIDEO, 'Failed to start next video playing')
        return
      }

      // Update hidden buffer
      const nextTexture = videoPool.textures[videoPool.nextIndex]
      if ('uniforms' in hiddenBuffer.material) {
        hiddenBuffer.material.uniforms.videoTexture.value = nextTexture
        hiddenBuffer.material.uniforms.opacity.value = 0
      } else {
        hiddenBuffer.material.map = nextTexture
        hiddenBuffer.material.opacity = 0
      }
      hiddenBuffer.material.needsUpdate = true

      // Store timing info for transition
      hiddenBuffer._plannedStartTime = timing.startTime
      hiddenBuffer._plannedDuration = timing.duration
      hiddenBuffer._plannedVideoIndex = nextVideoSource.manifestIndex

      playbackState = {
        ...playbackState,
        isNextVideoPrepared: true,
      }

      log.debug(lc.GL_VIDEO, `Successfully prepared next video ${nextVideoSource.manifestIndex} (${nextVideoSource.filename})`)
    } catch (error) {
      log.error(lc.GL_VIDEO, 'Error preparing next video:', error)
    }
  }

  // Verify video timing after operations
  const verifyVideoTiming = (
    video: HTMLVideoElement,
    expectedTime: number,
    tolerance: number = 0.2,
  ): boolean => {
    const actualTime = video.currentTime
    const timeDiff = Math.abs(actualTime - expectedTime)
    const isCorrect = timeDiff <= tolerance

    if (!isCorrect) {
      log.warn(
        lc.GL_VIDEO,
        `Video timing mismatch: expected ${expectedTime.toFixed(2)}s, got ${actualTime.toFixed(2)}s (diff: ${timeDiff.toFixed(2)}s)`,
      )
    } else {
      log.trace(lc.GL_VIDEO, `Video timing correct: ${actualTime.toFixed(2)}s (expected: ${expectedTime.toFixed(2)}s)`)
    }

    return isCorrect
  }

  // Transition to next video
  const transitionToNext = (): void => {
    if (!playbackState.isNextVideoPrepared || isTransitioning) return

    try {
      isTransitioning = true

      const nextVideoIndex = hiddenBuffer._plannedVideoIndex!
      const nextDuration = hiddenBuffer._plannedDuration!
      const nextStartTime = hiddenBuffer._plannedStartTime!

      log.debug(lc.GL_VIDEO, `Transitioning to video ${nextVideoIndex} (duration: ${nextDuration.toFixed(2)}s)`)

      // Verify the prepared video is at the correct time
      const nextVideo = videoPool.videos[videoPool.nextIndex]
      verifyVideoTiming(nextVideo, nextStartTime)

      // Swap buffers
      const tempBuffer = activeBuffer
      activeBuffer = hiddenBuffer
      hiddenBuffer = tempBuffer

      // Rotate video pool indices forward
      const newActiveIndex = videoPool.nextIndex
      const newNextIndex = videoPool.backupIndex
      const newBackupIndex = videoPool.activeIndex

      videoPool.activeIndex = newActiveIndex
      videoPool.nextIndex = newNextIndex
      videoPool.backupIndex = newBackupIndex

      log.trace(lc.GL_VIDEO, `Pool indices rotated: active=${newActiveIndex}, next=${newNextIndex}, backup=${newBackupIndex}`)

      // Update buffer opacities
      if ('uniforms' in activeBuffer.material && 'uniforms' in hiddenBuffer.material) {
        activeBuffer.material.uniforms.opacity.value = opacity
        hiddenBuffer.material.uniforms.opacity.value = 0
      } else {
        activeBuffer.material.opacity = opacity
        hiddenBuffer.material.opacity = 0
      }
      activeBuffer.material.needsUpdate = true
      hiddenBuffer.material.needsUpdate = true

      // Pause old video after delay to avoid hitching
      const oldVideo = videoPool.videos[videoPool.backupIndex]
      setTimeout(() => {
        if (!oldVideo.paused) {
          oldVideo.pause()
          log.trace(lc.GL_VIDEO, `Paused old video (index ${videoPool.backupIndex})`)
        }
      }, ms('0.5s'))

      // Update playback state
      playbackState = {
        ...playbackState,
        currentManifestIndex: nextVideoIndex,
        recentIndices: [nextVideoIndex, ...playbackState.recentIndices].slice(0, antiRepeat),
        currentDuration: nextDuration,
        currentStartTime: nextStartTime,
        timeSinceSwitch: 0,
        isNextVideoPrepared: false,
      }

      log.debug(lc.GL_VIDEO, `Successfully transitioned to video ${nextVideoIndex}`)
      isTransitioning = false
    } catch (error) {
      log.error(lc.GL_VIDEO, 'Error in video transition:', error)
      isTransitioning = false
    }
  }

  // Main update loop
  const update = async (_delta: number): Promise<void> => {
    if (!enabled || !playbackState.isPlaying || isTransitioning) return

    const activeVideo = videoPool.videos[videoPool.activeIndex]
    if (!activeVideo) {
      log.warn(lc.GL_VIDEO, 'No active video found in update loop')
      return
    }

    // Calculate buffer state
    const bufferState = calculateBufferState({
      currentStartTime: playbackState.currentStartTime,
      currentDuration: playbackState.currentDuration,
      currentVideoTime: activeVideo.currentTime,
      transitionTriggerPoint: calculatePreparationTiming(playbackState.currentDuration),
      isNextVideoPrepared: playbackState.isNextVideoPrepared,
    })

    // Update timing
    playbackState = {
      ...playbackState,
      timeSinceSwitch: bufferState.elapsedTime * 1000,
    }

    // Prepare next video if needed
    if (bufferState.shouldPrepareNext) {
      log.debug(lc.GL_VIDEO, `Preparing next video at ${(bufferState.progress * 100).toFixed(1)}% progress`)
      await prepareNextVideo()
    }

    // Transition if needed
    if (bufferState.shouldTransition) {
      log.debug(
        lc.GL_VIDEO,
        `Video transition triggered: ${bufferState.hasLooped ? 'looped' : 'duration exceeded'} (progress: ${
          (bufferState.progress * 100).toFixed(1)
        }%)`,
      )
      await transitionToNext()
    }
  }

  // Cleanup
  const dispose = (): void => {
    if (videoPool) {
      videoPool.videos.forEach((video) => {
        video.pause()
        video.src = ''
        video.load()
      })
      videoPool.textures.forEach((texture) => texture.dispose())
    }
  }

  // Debug info
  const getDebugInfo = () => {
    const activeVideo = videoPool?.videos[videoPool.activeIndex]
    const currentVideoName = activeVideo?.src?.split('/').pop() || 'Unknown'

    return {
      isPlaying: playbackState?.isPlaying || false,
      currentVideoIndex: playbackState?.currentManifestIndex || -1,
      currentVideoName,
      currentVideoSrc: activeVideo?.src || '',
      timeSinceSwitch: playbackState?.timeSinceSwitch || 0,
      currentDuration: playbackState?.currentDuration || 0,
      fullVideoDuration: activeVideo?.duration || 0,
      videoStartTime: playbackState?.currentStartTime || 0,
      totalVideos: manifest?.totalCount || 0,
      recentIndices: playbackState?.recentIndices || [],
      nextPreparedIndex: playbackState?.isNextVideoPrepared ? videoPool?.nextIndex : null,
      nextPreparedVideoName: playbackState?.isNextVideoPrepared
        ? videoPool?.videos[videoPool.nextIndex]?.src?.split('/').pop() || null
        : null,
      isTransitioning,
      loadingProgress: {
        loaded: 3, // Always 3 video elements in pool
        total: manifest?.totalCount || 0,
        hasMoreToLoad: false,
      },
    }
  } // Initialize and start
  ;(async () => {
    await initialize()
    if (manifest.totalCount >= 2) {
      await startPlayback()
    }
  })()

  return {
    update,
    dispose,
    mesh: activeBuffer.mesh,
    handleResize: () => {},
    getDebugInfo,
  }
}
