import * as THREE from 'three'
import { lc, log } from '@lib/logger/index.ts'
import { VIDEO_CYCLE_CONFIG } from './config.ts'
import { debugVideoAccess } from './utils/debugVideoAccess.ts'
import { getNewStartTimeAndDuration } from './utils/getNewStartTimeAndDuration.ts'
import { getNextVideoIndex } from './utils/getNextVideoIndex.ts'
import { prepareNextVideo } from './utils/prepareNextVideo.ts'
import { swapBuffers } from './utils/swapBuffers.ts'
import { loadVideos } from './utils/loadVideos.ts'
import type { VideoBackgroundManager } from '../../types.ts'
import type { BufferObject } from './types.ts'
import ms from 'ms'

export const createVideoCycle = async (
  THREE: typeof import('three'),
  frontBuffer: BufferObject,
  backBuffer: BufferObject,
): Promise<VideoBackgroundManager> => {
  // Try to debug server access first
  const workingPath = await debugVideoAccess()

  if (workingPath) {
    log(lc.GL, `Using detected working path: ${workingPath}`)
    VIDEO_CYCLE_CONFIG.videos.path = workingPath
  } else {
    log.warn(lc.GL, '⚠️ Could not detect a working path for videos. Server configuration issue likely.')
    log.warn(lc.GL, 'Try checking: 1) CORS settings 2) Static file serving 3) MIME types for .webm')
  }

  const videos: HTMLVideoElement[] = []
  const videoTextures: THREE.VideoTexture[] = []
  const currentOpacity = VIDEO_CYCLE_CONFIG.appearance.opacity
  const VIDEO_SWAP_TIMEOUT_MS = ms('1s')
  const PREPARE_PREROLL_MS = ms('.5s')
  let currentVideoIndex = 0
  let nextVideoIndex = 0
  let recentVideoIndices: number[] = []
  let timeSinceLastSwitch = 0
  let switchDuration = 10

  // Track which buffer is currently visible
  let activeBuffer: BufferObject = frontBuffer
  let hiddenBuffer: BufferObject = backBuffer

  // Ensure the active buffer is visible from the start
  activeBuffer.material.opacity = currentOpacity
  activeBuffer.material.needsUpdate = true

  // Load videos using the utility function
  const loadedVideos = await loadVideos()
  videos.push(...loadedVideos.videos)
  videoTextures.push(...loadedVideos.videoTextures)

  // Set up initial video on the active buffer
  if (videos.length > 0 && videoTextures.length > 0) {
    currentVideoIndex = Math.floor(Math.random() * videos.length)
    recentVideoIndices = [currentVideoIndex]
    const initialVideo = videos[currentVideoIndex]
    const initialTexture = videoTextures[currentVideoIndex]

    activeBuffer.material.map = initialTexture
    activeBuffer.material.opacity = currentOpacity // Make the initial active buffer visible
    activeBuffer.material.needsUpdate = true
    log(lc.GL, 'Video texture assigned to material for initial video')

    // Ensure we have a video and texture to play
    if (initialVideo && initialTexture) {
      try {
        const result = await getNewStartTimeAndDuration(
          initialVideo,
          VIDEO_CYCLE_CONFIG.cycling.minVideoLength,
          VIDEO_CYCLE_CONFIG.cycling.maxVideoLength,
        )
        switchDuration = result.duration
        await initialVideo.play()
        log(
          lc.GL_TEXTURES,
          `[${new Date().toLocaleTimeString()}] Initial video ${currentVideoIndex} began at ${result.startTime.toFixed(2)}s for ${
            result.duration.toFixed(2)
          }s`,
        )
      } catch (error) {
        log.error(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] Error starting initial video ${currentVideoIndex}:`, error)
      }
    } else log.warn(lc.GL_TEXTURES, '❌ Initial video or texture missing, cannot start playback.')

    log(lc.GL_TEXTURES, `Initial video set to ${currentVideoIndex}`)

    // Prepare next video on hidden buffer if we have more than one video
    if (videos.length > 1) {
      const candidateIndex = getNextVideoIndex(currentVideoIndex, recentVideoIndices, videos.length)
      nextVideoIndex = await prepareNextVideo(
        candidateIndex,
        videos,
        videoTextures,
        currentVideoIndex,
        recentVideoIndices,
        hiddenBuffer,
        PREPARE_PREROLL_MS,
      )
      if (nextVideoIndex === -1) {
        log.warn(
          lc.GL_TEXTURES,
          `[${new Date().toLocaleTimeString()}] Initial prepareNextVideo failed to find a video. Cycling may be impaired.`,
        )
      }
    }
  } else log.warn(lc.GL_TEXTURES, 'No videos could be loaded from the specified directory')

  /**
   * Update function called every frame
   */
  const update = async (delta: number) => {
    if (!VIDEO_CYCLE_CONFIG.enabled || videos.length < 2) return

    // Check if it's time to switch videos
    timeSinceLastSwitch += delta

    // Simplified: just check if we have a prepared video ready
    const hasNextVideoReady = nextVideoIndex !== -1 && hiddenBuffer._plannedVideoIndex !== undefined

    if (timeSinceLastSwitch >= switchDuration && hasNextVideoReady) {
      if (nextVideoIndex !== -1 && nextVideoIndex !== currentVideoIndex) {
        // Swap buffers to show the already-prepared video
        const swapResult = await swapBuffers({
          activeBuffer,
          hiddenBuffer,
          videos,
          currentOpacity,
          VIDEO_SWAP_TIMEOUT_MS,
        })

        if (swapResult.success) {
          // Flip 'dem buffers
          activeBuffer = swapResult.newActiveBuffer
          hiddenBuffer = swapResult.newHiddenBuffer
          recentVideoIndices.unshift(swapResult.plannedVideoIndex)
          if (recentVideoIndices.length > VIDEO_CYCLE_CONFIG.cycling.antiRepeat) recentVideoIndices.pop()
          currentVideoIndex = swapResult.plannedVideoIndex
          switchDuration = swapResult.plannedDuration
          timeSinceLastSwitch = 0

          log(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] Switched to video ${currentVideoIndex}.`)
          log(lc.GL_TEXTURES, `New switchDuration: ${switchDuration.toFixed(2)}s (from hiddenBuffer preparation)`)

          // What's the next awesome video?
          const candidateForNext = getNextVideoIndex(currentVideoIndex, recentVideoIndices, videos.length)
          nextVideoIndex = await prepareNextVideo(
            candidateForNext,
            videos,
            videoTextures,
            currentVideoIndex,
            recentVideoIndices,
            hiddenBuffer,
            PREPARE_PREROLL_MS,
          )
          if (nextVideoIndex === -1) log.warn(lc.GL_TEXTURES, `[${new Date().toLocaleTimeString()}] next video failed. May pause/skip.`)
        } else nextVideoIndex = -1 // Force re-preparation
      } else if (nextVideoIndex === -1) {
        log.warn(
          lc.GL_TEXTURES,
          `[${new Date().toLocaleTimeString()}] Time to switch, but nextVideoIndex is -1 (preparation failed). Attempting to re-prepare.`,
        )
        timeSinceLastSwitch = 0 // Reset timer to avoid rapid re-attempts if prep is slow
        const candidateForNextAfterFailure = getNextVideoIndex(currentVideoIndex, recentVideoIndices, videos.length)
        nextVideoIndex = await prepareNextVideo(
          candidateForNextAfterFailure,
          videos,
          videoTextures,
          currentVideoIndex,
          recentVideoIndices,
          hiddenBuffer,
          PREPARE_PREROLL_MS,
        )
      } else {
        // This case (nextVideoIndex === currentVideoIndex) should ideally not happen
        timeSinceLastSwitch = 0

        if (videos.length > 1) {
          log.warn(
            lc.GL_TEXTURES,
            `[${new Date().toLocaleTimeString()}] 
            Time to switch, but nextVideoIndex (${nextVideoIndex}) is same as current (${currentVideoIndex}). Attempting to re-prepare.`,
          )
          const candidateForNextSameIndex = getNextVideoIndex(
            currentVideoIndex,
            [...recentVideoIndices, currentVideoIndex],
            videos.length,
          )
          nextVideoIndex = await prepareNextVideo(
            candidateForNextSameIndex,
            videos,
            videoTextures,
            currentVideoIndex,
            recentVideoIndices,
            hiddenBuffer,
            PREPARE_PREROLL_MS,
          )
        }
      }
    }
  }

  /**
   * Dispose function to clean up resources
   */
  const dispose = () => {
    videoTextures.forEach((texture) => texture.dispose())
    videos.forEach((video) => {
      video.pause()
      video.src = ''
      video.load()
    })
  }

  // Return the manager interface
  return {
    update,
    dispose,
    mesh: activeBuffer.mesh, // Return active mesh for compatibility
  } as VideoBackgroundManager
}
