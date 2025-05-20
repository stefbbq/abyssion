import * as THREE from 'three'
import { VIDEO_CYCLE_CONFIG } from './config.ts'
import { debugVideoAccess } from './utils/debugVideoAccess.ts'
import { getRandomSwitchDuration } from './utils/getRandomSwitchDuration.ts'
import { createVideoPlane } from './utils/createVideoPlane.ts'
import { calculateScale } from './utils/calculateScale.ts'
import { seekToRandomPosition } from './utils/seekToRandomPosition.ts'
import { loadVideo } from './utils/loadVideo.ts'
// Using inline implementation instead of the imported function
// import { isVideoReady } from './utils/isVideoReady.ts'
import { getNextVideoIndex } from './utils/getNextVideoIndex.ts'
import type { VideoBackgroundManager } from '../../types.ts'

/**
 * Create a video cycle manager that cycles through videos
 * with customizable behavior based on configuration
 */
export const createVideoCycle = async (
  THREE: typeof import('three'),
  scene: THREE.Scene,
): Promise<VideoBackgroundManager> => {
  // Try to debug server access first
  const workingPath = await debugVideoAccess()
  if (workingPath) {
    console.log(`Using detected working path: ${workingPath}`)
    // Update the config to use the working path
    VIDEO_CYCLE_CONFIG.videos.path = workingPath
  } else {
    console.warn('⚠️ Could not detect a working path for videos. Server configuration issue likely.')
    console.warn('Try checking: 1) CORS settings 2) Static file serving 3) MIME types for .webm')
  }

  // Array to store loaded video elements and textures
  const videos: HTMLVideoElement[] = []
  const videoTextures: THREE.VideoTexture[] = []
  let currentVideoIndex = 0
  let nextVideoIndex = 0
  let recentVideoIndices: number[] = [] // Track recent videos to avoid repeating
  let timeSinceLastSwitch = 0
  const currentOpacity = VIDEO_CYCLE_CONFIG.appearance.opacity

  let switchDuration = getRandomSwitchDuration()

  // Create two layers - one visible, one hidden for buffering
  const frontBuffer = createVideoPlane(THREE, scene)
  const backBuffer = createVideoPlane(THREE, scene)

  // Track which buffer is currently visible
  let activeBuffer = frontBuffer
  let hiddenBuffer = backBuffer

  // Update scale on window resize
  const handleResize = () => {
    calculateScale(frontBuffer)
    calculateScale(backBuffer)
  }

  // Add resize event listener
  globalThis.addEventListener('resize', handleResize)

  // Initialize both buffers
  calculateScale(frontBuffer)
  calculateScale(backBuffer)
  
  // Ensure the active buffer is visible from the start
  activeBuffer.material.opacity = currentOpacity
  activeBuffer.material.needsUpdate = true

  /**
   * Check if a video at the given index is ready for playback
   */
  const checkVideoReady = (index: number): boolean => {
    return index >= 0 && 
           index < videos.length && 
           videos[index] && 
           videos[index].readyState >= 3 && // HAVE_FUTURE_DATA or higher
           !isNaN(videos[index].duration) &&
           videos[index].videoWidth > 0 // Ensure video has dimensions
  }

  /**
   * Prepare the hidden buffer with the next video
   */
  const prepareNextVideo = async (videoIndex: number) => {
    if (videoIndex < 0 || videoIndex >= videos.length) {
      console.warn(`Invalid video index: ${videoIndex}`)
      return
    }

    // Set texture and play video
    const texture = videoTextures[videoIndex]
    hiddenBuffer.material.map = texture
    hiddenBuffer.material.needsUpdate = true

    // Make sure video is ready to play
    const video = videos[videoIndex]
    if (!video) {
      console.warn(`Video at index ${videoIndex} is not available`)
      return
    }

    // Log the video's readiness state
    console.log(`Video ${videoIndex} - readyState: ${video.readyState}, dimensions: ${video.videoWidth}x${video.videoHeight}`)

    // Force video to play regardless of previous state
    try {
      // First seek to a random position
      await seekToRandomPosition(video)
      
      // Make sure it's playing
      if (video.paused) {
        console.log(`Playing video ${videoIndex}`)
        await video.play()
      } else {
        console.log(`Video ${videoIndex} already playing`)
      }
    } catch (error) {
      console.error('Error preparing video:', error)
    }
  }

  /**
   * Swap the buffers to show the prepared video
   */
  const swapBuffers = () => {
    // Swap active and hidden buffers
    const temp = activeBuffer
    activeBuffer = hiddenBuffer
    hiddenBuffer = temp

    // Make active buffer visible
    activeBuffer.material.opacity = currentOpacity

    // Make hidden buffer invisible
    hiddenBuffer.material.opacity = 0
  }

  /**
   * Load videos from the videos directory using manifest
   */
  const loadVideos = async () => {
    try {
      console.log('Loading video backgrounds...')

      // Path to the video manifest
      const manifestPath = `${VIDEO_CYCLE_CONFIG.videos.path}manifest.json`

      // Fetch the manifest
      let videoFiles: string[] = []

      try {
        const response = await fetch(manifestPath)
        if (!response.ok) {
          throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`)
        }

        const manifest = await response.json()
        if (manifest && manifest.videos && Array.isArray(manifest.videos)) {
          videoFiles = manifest.videos.map((video: any) => {
            if (typeof video === 'string') {
              return video
            } else if (video && video.file) {
              return video.file
            }
            return null
          }).filter(Boolean)
        }
      } catch (error) {
        console.error('Error loading video manifest:', error)
        console.warn('Falling back to default video')

        // Fallback to a single default video if available
        videoFiles = ['default.webm']
      }

      if (videoFiles.length === 0) {
        console.warn('No video files found in manifest')
        return
      }

      console.log(`Found ${videoFiles.length} videos in manifest`)

      // Try to load each video
      for (const file of videoFiles) {
        const videoPath = `${VIDEO_CYCLE_CONFIG.videos.path}${file}`
        console.log(`Attempting to load video: ${videoPath}`)

        const { video, texture, success } = await loadVideo(videoPath)

        if (success && texture) {
          videos.push(video)
          videoTextures.push(texture)
        }
      }

      console.log(`Successfully loaded ${videos.length} of ${videoFiles.length} videos`)

      if (videos.length === 0) {
        console.error('Failed to load any videos from any paths')
        return
      }

      // Set up initial video on the active buffer
      if (videos.length > 0 && videoTextures.length > 0) {
        // Choose a random video to start with
        currentVideoIndex = Math.floor(Math.random() * videos.length)
        recentVideoIndices = [currentVideoIndex] // Initialize recent indices

        // Set initial texture on active buffer
        activeBuffer.material.map = videoTextures[currentVideoIndex]
        activeBuffer.material.opacity = currentOpacity
        activeBuffer.material.needsUpdate = true

        if (activeBuffer.material.map) {
          console.log('✅ Video texture assigned to material for initial video')
        } else {
          console.warn('❌ Video texture NOT assigned to material for initial video')
        }

        console.log(`Initial video set to ${currentVideoIndex}`)

        // Prepare next video on hidden buffer if we have more than one video
        if (videos.length > 1) {
          nextVideoIndex = getNextVideoIndex(currentVideoIndex, recentVideoIndices, videos.length)
          await prepareNextVideo(nextVideoIndex)
        }
      } else {
        console.warn('No videos could be loaded from the specified directory')
      }
    } catch (error) {
      console.error('Error loading video backgrounds:', error)
    }
  }

  /**
   * Update function called every frame
   */
  const update = (delta: number) => {
    if (!VIDEO_CYCLE_CONFIG.enabled || videos.length < 2) return

    // Check if it's time to switch videos
    timeSinceLastSwitch += delta

    if (timeSinceLastSwitch >= switchDuration) {
      // Swap buffers to show the already-prepared video
      swapBuffers()

      // Update recent video indices
      recentVideoIndices.unshift(currentVideoIndex)
      if (recentVideoIndices.length > VIDEO_CYCLE_CONFIG.cycling.antiRepeat) {
        recentVideoIndices.pop()
      }

      // Update current index
      currentVideoIndex = nextVideoIndex

      // Reset timer
      timeSinceLastSwitch = 0
      switchDuration = getRandomSwitchDuration()

      // Log the switch
      console.log(`Switched to video ${currentVideoIndex}, next switch in ${switchDuration.toFixed(2)}s`)

      // Find next video to prepare
      let attempts = 0
      const maxAttempts = 10
      let foundNext = false

      // Try to find a ready video that's different from recent ones
      while (!foundNext && attempts < maxAttempts) {
        // Select next video avoiding recent ones
        const candidateIndex = getNextVideoIndex(currentVideoIndex, recentVideoIndices, videos.length)

        // Check if it's ready
        if (checkVideoReady(candidateIndex)) {
          nextVideoIndex = candidateIndex
          foundNext = true

          // Prepare the selected video on the hidden buffer
          prepareNextVideo(nextVideoIndex)
        }

        attempts++
      }

      // If we couldn't find a ready video, try again next frame
      if (!foundNext) {
        console.warn('Could not find a ready video for next switch')
      }
    }
  }

  /**
   * Dispose function to clean up resources
   */
  const dispose = () => {
    // Remove event listeners
    globalThis.removeEventListener('resize', handleResize)

    // Remove both buffer meshes
    scene.remove(frontBuffer.mesh)
    scene.remove(backBuffer.mesh)

    // Dispose geometries and materials
    frontBuffer.geometry.dispose()
    frontBuffer.material.dispose()
    backBuffer.geometry.dispose()
    backBuffer.material.dispose()

    // Dispose textures and stop videos
    videoTextures.forEach((texture) => texture.dispose())
    videos.forEach((video) => {
      video.pause()
      video.src = ''
      video.load()
    })
  }

  // Load videos on initialization
  await loadVideos()

  // Return the manager interface
  return {
    update,
    dispose,
    mesh: activeBuffer.mesh, // Return active mesh for compatibility
  } as VideoBackgroundManager
}
