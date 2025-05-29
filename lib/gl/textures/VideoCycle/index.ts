import * as THREE from 'three'
import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfig from '@lib/configVideoCycle.json' with { type: 'json' }
import { debugVideoAccess } from './utils/debugVideoAccess.ts'
import { getNewStartTimeAndDuration } from './utils/getNewStartTimeAndDuration.ts'
import { loadVideos } from './utils/loadVideos.ts'
import type { VideoBackgroundManager } from '../../types.ts'
import type { BufferObject } from './types.ts'
import ms from 'ms'

export const createVideoCycle = async (
  frontBuffer: BufferObject,
  backBuffer: BufferObject,
): Promise<VideoBackgroundManager> => {
  const {
    enabled,
    cycling: { minVideoLength, maxVideoLength, antiRepeat },
    appearance: { opacity },
    videos: videosConfig,
  } = videoCycleConfig

  // Try to debug server access first
  const workingPath = await debugVideoAccess()

  if (workingPath) {
    log(lc.GL, `Using detected working path: ${workingPath}`)
    videosConfig.path = workingPath
  } else {
    log.warn(lc.GL, '⚠️ Could not detect a working path for videos. Server configuration issue likely.')
    log.warn(lc.GL, 'Try checking: 1) CORS settings 2) Static file serving 3) MIME types for .webm')
  }

  // The array that playback uses - that's it!
  const readyVideos: { video: HTMLVideoElement; texture: THREE.VideoTexture }[] = []

  // Playback state
  let currentIndex = -1
  let recentIndices: number[] = []
  let timeSinceSwitch = 0
  let currentDuration = 10
  let isPlaying = false

  // Buffers
  let activeBuffer: BufferObject = frontBuffer
  let hiddenBuffer: BufferObject = backBuffer
  activeBuffer.material.opacity = opacity
  activeBuffer.material.needsUpdate = true

  /**
   * Initializes video loading and background loading process
   *
   * Loads initial videos and starts playback if enough are available.
   * Continues loading additional videos in the background with a delay
   * between loads to prevent overwhelming the system.
   */
  const startLoading = async () => {
    const loader = await loadVideos()

    // Add initial videos
    loader.videos.forEach((video, i) => {
      readyVideos.push({ video, texture: loader.videoTextures[i] })
      log(lc.GL_TEXTURES, `Video ready. Total: ${readyVideos.length}`)
    })

    // Start playback if we have enough
    if (readyVideos.length >= 2 && !isPlaying) startPlayback()

    // Load more in background
    setTimeout(async () => {
      while (loader.hasMoreVideos()) {
        const { video, texture } = await loader.loadNextVideo()
        if (video && texture) {
          readyVideos.push({ video, texture })
          log(lc.GL_TEXTURES, `Background video ready. Total: ${readyVideos.length}`)

          // Start if this gives us enough videos
          if (readyVideos.length === 2 && !isPlaying) startPlayback()
        }
        await new Promise((resolve) => setTimeout(resolve, ms('500ms')))
      }
    }, ms('2s'))
  }

  /**
   * Initiates video playback by selecting a random starting video and configuring the active buffer
   */
  const startPlayback = async () => {
    if (isPlaying || readyVideos.length < 2) return

    isPlaying = true
    log(lc.GL_TEXTURES, `Starting playback with ${readyVideos.length} videos`)

    // Pick random starting video
    currentIndex = Math.floor(Math.random() * readyVideos.length)
    recentIndices = [currentIndex]

    const current = readyVideos[currentIndex]
    activeBuffer.material.map = current.texture
    activeBuffer.material.needsUpdate = true

    const result = await getNewStartTimeAndDuration(current.video, minVideoLength, maxVideoLength)
    currentDuration = result.duration
    current.video.currentTime = result.startTime
    current.video.play()

    log(lc.GL_TEXTURES, `Started with video ${currentIndex}`)
  }

  startLoading()

  // UPDATE - cycles through array with randomness
  /**
   * Updates the video cycle state and handles video transitions
   * @param delta - Time elapsed since last update in seconds
   * @returns Promise that resolves when video transition is complete
   */
  const update = async (delta: number): Promise<void> => {
    if (!enabled || !isPlaying || readyVideos.length < 2) return

    timeSinceSwitch += delta

    if (timeSinceSwitch >= currentDuration) {
      // Pick next video avoiding recent ones
      let nextIndex = currentIndex
      let attempts = 0

      while ((nextIndex === currentIndex || recentIndices.includes(nextIndex)) && attempts < readyVideos.length) {
        nextIndex = Math.floor(Math.random() * readyVideos.length)
        attempts++
      }

      // Fallback to sequential if random fails
      if (nextIndex === currentIndex) nextIndex = (currentIndex + 1) % readyVideos.length

      // Update state
      currentIndex = nextIndex
      recentIndices.unshift(currentIndex)
      if (recentIndices.length > antiRepeat) recentIndices.pop()

      // Swap buffers
      const temp = activeBuffer
      activeBuffer = hiddenBuffer
      hiddenBuffer = temp

      // Set up new video
      const next = readyVideos[currentIndex]
      activeBuffer.material.map = next.texture
      activeBuffer.material.opacity = opacity
      hiddenBuffer.material.opacity = 0
      activeBuffer.material.needsUpdate = true
      hiddenBuffer.material.needsUpdate = true

      // Play it
      const result = await getNewStartTimeAndDuration(next.video, minVideoLength, maxVideoLength)
      currentDuration = result.duration
      next.video.currentTime = result.startTime
      next.video.play()

      timeSinceSwitch = 0
      log(lc.GL_TEXTURES, `Switched to video ${currentIndex} (recent: [${recentIndices.join(',')}])`)
    }
  }

  const dispose = () => {
    readyVideos.forEach(({ video, texture }) => {
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
  } as VideoBackgroundManager
}
