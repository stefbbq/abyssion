import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfig from '@libgl/configVideoCycle.json' with { type: 'json' }
import { getNewStartTimeAndDuration } from './utils/getNewStartTimeAndDuration.ts'
import { createVideoLoadingStream } from './utils/createVideoLoadingStream.ts'
import { createInitialPlaybackState } from './utils/createInitialPlaybackState.ts'
import { shouldStartPlayback } from './utils/shouldStartPlayback.ts'
import { selectNextVideoIndex } from './utils/selectNextVideoIndex.ts'
import { updateRecentIndices } from './utils/updateRecentIndices.ts'
import type { VideoBackgroundManager } from '@libgl/types.ts'
import type { BufferObject, PlaybackState, VideoTexture } from './types.ts'
import ms from 'ms'

export const createVideoCycle = (
  frontBuffer: BufferObject,
  backBuffer: BufferObject,
): VideoBackgroundManager => {
  const {
    enabled,
    cycling: { minVideoLength, maxVideoLength, antiRepeat },
    appearance: { opacity },
  } = videoCycleConfig

  // Immutable state - only updated through pure functions
  let playbackState: PlaybackState = createInitialPlaybackState([])

  // Prevent concurrent transitions
  let isTransitioning = false
  let transitionStartTime = 0
  let nextVideoPrepared = false
  // deno-lint-ignore no-unused-vars
  let preparedVideoIndex = -1
  let nextVideoPreparationTriggerTime = 0

  // Buffers - mutable boundary
  let activeBuffer: BufferObject = frontBuffer
  let hiddenBuffer: BufferObject = backBuffer
  activeBuffer.material.opacity = opacity
  activeBuffer.material.needsUpdate = true

  /**
   * Updates playback state immutably with new videos
   */
  const updateStateWithNewVideos = (newVideos: VideoTexture[]): PlaybackState => {
    return {
      ...playbackState,
      videos: newVideos,
    }
  }

  /**
   * Prepares the next video in the background for smooth transitions
   */
  const prepareNextVideo = async (state: PlaybackState): Promise<void> => {
    if (nextVideoPrepared) {
      log.trace(lc.GL_TEXTURES, `Preparation skipped: already prepared`)
      return
    }
    if (state.videos.length < 2) {
      log.trace(lc.GL_TEXTURES, `Preparation skipped: not enough videos (${state.videos.length})`)
      return
    }

    log.debug(lc.GL_TEXTURES, `Starting preparation for next video (current: ${state.currentIndex})`)
    try {
      const nextIndex = selectNextVideoIndex(
        state.currentIndex,
        state.recentIndices,
        state.videos.length,
      )

      const nextVideo = state.videos[nextIndex]

      // Wait for video to be ready (reduce readyState requirement)
      if (nextVideo.video.readyState < 2) {
        await new Promise<void>((resolve, reject) => {
          let attempts = 0
          const maxAttempts = 50 // 5 seconds max

          const checkReady = () => {
            attempts++
            if (nextVideo.video.readyState >= 2) resolve()
            else if (attempts >= maxAttempts) reject(new Error('Video not ready'))
            else setTimeout(checkReady, ms('0.1s'))
          }

          checkReady()
        })
      }

      // Set up hidden buffer with next video
      if ('uniforms' in hiddenBuffer.material) {
        // ShaderMaterial
        hiddenBuffer.material.uniforms.videoTexture.value = nextVideo.texture
        hiddenBuffer.material.uniforms.opacity.value = 0 // Keep hidden initially
      } else {
        // Fallback for MeshBasicMaterial
        hiddenBuffer.material.map = nextVideo.texture
        hiddenBuffer.material.opacity = 0
      }
      hiddenBuffer.material.needsUpdate = true

      // Prepare video timing
      const result = await getNewStartTimeAndDuration(nextVideo.video, minVideoLength, maxVideoLength)
      nextVideo.video.currentTime = result.startTime

      // Add timeout protection for video.play()
      await Promise.race([
        nextVideo.video.play(),
        new Promise<void>((_, reject) => setTimeout(() => reject(new Error(`Video ${nextIndex} preparation play timed out`)), ms('3s'))),
      ])

      // Store preparation state
      nextVideoPrepared = true
      preparedVideoIndex = nextIndex

      // Store timing info in buffer for later use
      hiddenBuffer._plannedStartTime = result.startTime
      hiddenBuffer._plannedDuration = result.duration
      hiddenBuffer._plannedVideoIndex = nextIndex

      log.trace(lc.GL_TEXTURES, `Prepared video ${nextIndex} for smooth transition (duration: ${result.duration.toFixed(2)}s)`)
    } catch (error) {
      log.warn(lc.GL_TEXTURES, `Failed to prepare next video:`, error)
      nextVideoPrepared = false
      preparedVideoIndex = -1
      // Clear any preparation state on the hidden buffer
      hiddenBuffer._plannedStartTime = undefined
      hiddenBuffer._plannedDuration = undefined
      hiddenBuffer._plannedVideoIndex = undefined
    }
  }

  /**
   * Starts playback by selecting initial video and updating state
   */
  const startPlayback = async (state: PlaybackState): Promise<PlaybackState> => {
    if (state.isPlaying || state.videos.length < 2 || isTransitioning) return state

    try {
      isTransitioning = true
      log(lc.GL_TEXTURES, `🎥 Starting playback with ${state.videos.length} videos`)

      // Pick random starting video
      const currentIndex = Math.floor(Math.random() * state.videos.length)
      const recentIndices = [currentIndex]
      const current = state.videos[currentIndex]

      log.debug(lc.GL_TEXTURES, `Selected video ${currentIndex} for startup, readyState: ${current.video.readyState}`)

      // Wait for video to have enough data (reduce readyState requirement)
      if (current.video.readyState < 2) {
        log.trace(lc.GL_TEXTURES, `Video ${currentIndex} not ready (readyState=${current.video.readyState}), waiting...`)

        await new Promise<void>((resolve) => {
          const checkReady = () => {
            log.trace(lc.GL_TEXTURES, `Checking readyState: ${current.video.readyState}`)
            if (current.video.readyState >= 2) resolve()
            else setTimeout(checkReady, ms('0.1s'))
          }
          checkReady()
        })
      }

      log.debug(lc.GL_TEXTURES, `Video ${currentIndex} readyState check passed: ${current.video.readyState}`)

      log.debug(lc.GL_TEXTURES, `Setting up material for video ${currentIndex}`)
      if ('uniforms' in activeBuffer.material) {
        // ShaderMaterial
        activeBuffer.material.uniforms.videoTexture.value = current.texture
        activeBuffer.material.uniforms.opacity.value = opacity
      } else {
        // Fallback for MeshBasicMaterial
        activeBuffer.material.map = current.texture
        activeBuffer.material.opacity = opacity
      }
      activeBuffer.material.needsUpdate = true

      log.debug(lc.GL_TEXTURES, `Getting start time and duration for video ${currentIndex}`)
      const result = await getNewStartTimeAndDuration(current.video, minVideoLength, maxVideoLength)
      log.debug(lc.GL_TEXTURES, `Got timing result: startTime=${result.startTime.toFixed(2)}s, duration=${result.duration.toFixed(2)}s`)

      current.video.currentTime = result.startTime
      log.debug(lc.GL_TEXTURES, `Set currentTime to ${result.startTime.toFixed(2)}s for video ${currentIndex}`)

      // Add timeout protection for video.play()
      log.debug(lc.GL_TEXTURES, `Attempting to play video ${currentIndex}`)
      await Promise.race([
        current.video.play(),
        new Promise<void>((_, reject) => setTimeout(() => reject(new Error(`Video ${currentIndex} startup play timed out`)), ms('3s'))),
      ])
      log.debug(lc.GL_TEXTURES, `Video ${currentIndex} play() completed successfully`)

      log.debug(lc.GL_TEXTURES, `Started with video ${currentIndex}, duration: ${result.duration}s`)

      // Start preparing next video in background
      const newState = {
        ...state,
        currentIndex,
        recentIndices,
        currentDuration: result.duration,
        timeSinceSwitch: 0,
        isPlaying: true,
      }

      isTransitioning = false

      // Schedule next video preparation when halfway through current one
      nextVideoPreparationTriggerTime = Date.now() + (result.duration * 500) // 50% through

      log.debug(lc.GL_TEXTURES, `startPlayback completed successfully, returning new state with isPlaying=${newState.isPlaying}`)
      return newState
    } catch (error) {
      log.error(lc.GL_TEXTURES, `Error starting playback:`, error)
      isTransitioning = false
      return state
    }
  }

  /**
   * Smoothly transitions to the prepared next video
   */
  const transitionToNextVideo = async (state: PlaybackState): Promise<PlaybackState> => {
    if (isTransitioning) {
      log.warn(lc.GL_TEXTURES, `Transition blocked: already transitioning`)
      return state
    }

    log.debug(lc.GL_TEXTURES, `Starting transition from video ${state.currentIndex} (prepared: ${nextVideoPrepared})`)
    isTransitioning = true
    transitionStartTime = Date.now()

    try {
      let nextIndex: number
      let updatedRecentIndices: readonly number[]
      let duration: number

      if (nextVideoPrepared && hiddenBuffer._plannedVideoIndex !== undefined) {
        // Use pre-prepared video for smooth transition
        nextIndex = hiddenBuffer._plannedVideoIndex
        duration = hiddenBuffer._plannedDuration || 10

        const videoName = state.videos[nextIndex]?.video?.src?.split('/').pop() || '(unknown)'
        log.debug(lc.GL_TEXTURES, `Smooth transition to prepared video ${nextIndex} (${videoName})`)

        // Just swap buffers - video is already playing!
        const temp = activeBuffer
        activeBuffer = hiddenBuffer
        hiddenBuffer = temp

        if ('uniforms' in activeBuffer.material && 'uniforms' in hiddenBuffer.material) {
          // ShaderMaterial
          activeBuffer.material.uniforms.opacity.value = opacity
          hiddenBuffer.material.uniforms.opacity.value = 0
        } else {
          // Fallback for MeshBasicMaterial
          activeBuffer.material.opacity = opacity
          hiddenBuffer.material.opacity = 0
        }
        activeBuffer.material.needsUpdate = true
        hiddenBuffer.material.needsUpdate = true

        updatedRecentIndices = updateRecentIndices(state.recentIndices, nextIndex, antiRepeat)
      } else {
        // Fallback to old method if preparation failed
        log.debug(lc.GL_TEXTURES, `Fallback transition (no prepared video)`)

        nextIndex = selectNextVideoIndex(
          state.currentIndex,
          state.recentIndices,
          state.videos.length,
        )

        updatedRecentIndices = updateRecentIndices(state.recentIndices, nextIndex, antiRepeat)

        // Swap buffers
        const temp = activeBuffer
        activeBuffer = hiddenBuffer
        hiddenBuffer = temp

        // Set up new video
        const next = state.videos[nextIndex]
        if ('uniforms' in activeBuffer.material && 'uniforms' in hiddenBuffer.material) {
          // ShaderMaterial
          activeBuffer.material.uniforms.videoTexture.value = next.texture
          activeBuffer.material.uniforms.opacity.value = opacity
          hiddenBuffer.material.uniforms.opacity.value = 0
        } else {
          // Fallback for MeshBasicMaterial
          activeBuffer.material.map = next.texture
          activeBuffer.material.opacity = opacity
          hiddenBuffer.material.opacity = 0
        }
        activeBuffer.material.needsUpdate = true
        hiddenBuffer.material.needsUpdate = true

        // Play it
        const result = await getNewStartTimeAndDuration(next.video, minVideoLength, maxVideoLength)
        next.video.currentTime = result.startTime

        // Add timeout protection for video.play()
        await Promise.race([
          next.video.play(),
          new Promise<void>((_, reject) => setTimeout(() => reject(new Error(`Video ${nextIndex} play timed out`)), ms('3s'))),
        ])

        duration = result.duration
      }

      // Reset preparation state
      nextVideoPrepared = false
      preparedVideoIndex = -1

      const newState = {
        ...state,
        currentIndex: nextIndex,
        recentIndices: updatedRecentIndices,
        currentDuration: duration,
        timeSinceSwitch: 0,
      }

      log(lc.GL_TEXTURES, `Switched to video ${nextIndex}, duration: ${duration.toFixed(2)}s (recent: [${updatedRecentIndices.join(',')}])`)

      isTransitioning = false
      transitionStartTime = 0

      // Schedule next video preparation for the following transition
      nextVideoPreparationTriggerTime = Date.now() + (duration * ms('0.5s')) // 50% through

      return newState
    } catch (error) {
      log.error(lc.GL_TEXTURES, `Error in transition:`, error)
      isTransitioning = false
      transitionStartTime = 0
      nextVideoPrepared = false
      preparedVideoIndex = -1
      nextVideoPreparationTriggerTime = 0

      // Clear any preparation state on error
      hiddenBuffer._plannedStartTime = undefined
      hiddenBuffer._plannedDuration = undefined
      hiddenBuffer._plannedVideoIndex = undefined

      // Return modified state with reset timer to prevent infinite loop
      return {
        ...state,
        timeSinceSwitch: 0,
        currentDuration: Math.max(state.currentDuration, 5), // Ensure minimum 5s before next attempt
      }
    }
  }

  // Initialize video loading stream
  const videoStream = createVideoLoadingStream() // Process video loading events
  ;(async () => {
    for await (const videos of videoStream) {
      log.trace(lc.GL_TEXTURES, `Videos loaded: ${videos.length}, currently playing: ${playbackState.isPlaying}`)

      // Check if we should start playback BEFORE updating state
      const shouldStart = shouldStartPlayback(videos.length, playbackState.isPlaying)
      log.trace(lc.GL_TEXTURES, `Should start playback: ${shouldStart}`)

      const newState = updateStateWithNewVideos(videos)

      // Start playback if conditions are met
      if (shouldStart) {
        log.trace(lc.GL_TEXTURES, `Starting playback...`)
        playbackState = await startPlayback(newState)
      } else playbackState = newState
    }
  })()

  /**
   * Updates the video cycle state and handles video transitions
   */
  const update = async (delta: number): Promise<void> => {
    if (!enabled) {
      log.trace(lc.GL_TEXTURES, `Update skipped: disabled`)
      return
    }
    if (!playbackState.isPlaying) {
      log.trace(lc.GL_TEXTURES, `Update skipped: not playing`)
      return
    }
    if (playbackState.videos.length < 2) {
      log.trace(lc.GL_TEXTURES, `Update skipped: not enough videos (${playbackState.videos.length})`)
      return
    }
    if (isTransitioning) {
      // Check if transition has been stuck for too long
      const transitionDuration = Date.now() - transitionStartTime
      if (transitionDuration > ms('10s')) {
        log.error(lc.GL_TEXTURES, `Transition stuck for ${transitionDuration}ms - forcing reset`)
        isTransitioning = false
        nextVideoPrepared = false
        preparedVideoIndex = -1
        transitionStartTime = 0
        nextVideoPreparationTriggerTime = 0
        // Clear any preparation state
        hiddenBuffer._plannedStartTime = undefined
        hiddenBuffer._plannedDuration = undefined
        hiddenBuffer._plannedVideoIndex = undefined
      } else {
        log.trace(lc.GL_TEXTURES, `Update skipped: currently transitioning (${transitionDuration}ms)`)
        return
      }
    }

    // Check if it's time to prepare next video
    if (nextVideoPreparationTriggerTime > 0 && Date.now() >= nextVideoPreparationTriggerTime) {
      log.debug(lc.GL_TEXTURES, `Triggering next video preparation`)
      nextVideoPreparationTriggerTime = 0 // Reset trigger
      prepareNextVideo(playbackState)
    }

    const newTimeSinceSwitch = playbackState.timeSinceSwitch + delta

    if (newTimeSinceSwitch >= playbackState.currentDuration) {
      log.debug(lc.GL_TEXTURES, `Time to transition: ${newTimeSinceSwitch.toFixed(2)}s >= ${playbackState.currentDuration.toFixed(2)}s`)
      playbackState = await transitionToNextVideo(playbackState)
    } else {
      playbackState = {
        ...playbackState,
        timeSinceSwitch: newTimeSinceSwitch,
      }
    }
  }

  const dispose = () => {
    playbackState.videos.forEach(({ video, texture }) => {
      texture.dispose()
      video.pause()
      video.src = ''
      video.load()
    })
  }

  return {
    update,
    dispose,
    mesh: activeBuffer.mesh,
    handleResize: () => {},
  }
}
