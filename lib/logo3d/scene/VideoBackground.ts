/**
 * VideoBackground.ts
 *
 * Manages a dynamic video background that cycles through videos
 * with configurable transitions, opacity, and positioning
 */

import type { VideoBackgroundManager } from '../types.ts'
import { VIDEO_BACKGROUND_CONFIG } from './config.ts'

/**
 * create a video background manager that cycles through videos
 * with customizable behavior based on configuration
 */
export const createVideoBackground = async (THREE: any, scene: any) => {
  // Debug server access to videos first
  const debugVideoAccess = async () => {
    console.log('Debugging video access...')
    // Try different path combinations
    const testPaths = [
      '/static/videos/cosmicHorror.webm',
      'static/videos/cosmicHorror.webm',
      '../static/videos/cosmicHorror.webm',
      './static/videos/cosmicHorror.webm',
      '/videos/cosmicHorror.webm',
      'videos/cosmicHorror.webm',
    ]

    for (const path of testPaths) {
      try {
        console.log(`Testing path: ${path}`)
        const response = await fetch(path, { method: 'HEAD' })
        console.log(`Status for ${path}: ${response.status} ${response.ok ? '✅' : '❌'}`)
        if (response.ok) {
          console.log(`Found working path: ${path}`)
          return path.substring(0, path.lastIndexOf('/') + 1) // Return the directory part
        }
      } catch (error) {
        console.warn(`Error testing ${path}:`, error)
      }
    }

    // If we couldn't access any videos, try a different approach
    console.log("Couldn't access videos through direct fetch, trying Image load test...")

    // Try to load an image from various paths to test general static file access
    const img = new Image()
    const testImage = () => {
      return new Promise((resolve) => {
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        // Unique timestamp to bypass cache
        img.src = `/static/favicon.ico?t=${Date.now()}`
      })
    }

    const imageLoaded = await testImage()
    console.log(`Static favicon.ico load test: ${imageLoaded ? '✅' : '❌'}`)

    return null // Couldn't find a working path
  }

  // Try to debug server access first
  const workingPath = await debugVideoAccess()
  if (workingPath) {
    console.log(`Using detected working path: ${workingPath}`)
    // Update the config to use the working path
    VIDEO_BACKGROUND_CONFIG.videos.path = workingPath
  } else {
    console.warn('⚠️ Could not detect a working path for videos. Server configuration issue likely.')
    console.warn('Try checking: 1) CORS settings 2) Static file serving 3) MIME types for .webm')
  }

  // Array to store loaded video elements and textures
  const videos: HTMLVideoElement[] = []
  const videoTextures: any[] = []
  let currentVideoIndex = 0
  let nextVideoIndex = 0
  let timeSinceLastSwitch = 0
  let currentOpacity = VIDEO_BACKGROUND_CONFIG.appearance.opacity

  // Get random duration for video display before switching
  const getRandomSwitchDuration = () => {
    const { minDuration, maxDuration } = VIDEO_BACKGROUND_CONFIG.cycling
    return minDuration + Math.random() * (maxDuration - minDuration)
  }

  let switchDuration = getRandomSwitchDuration()

  // Create two video planes for double-buffering (front and back buffers)
  const createVideoPlane = () => {
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0, // Start invisible
      side: THREE.FrontSide,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.z = VIDEO_BACKGROUND_CONFIG.position.z

    // Add to scene but start invisible
    scene.add(mesh)

    return { mesh, material, geometry }
  }

  // Create two layers - one visible, one hidden for buffering
  const frontBuffer = createVideoPlane()
  const backBuffer = createVideoPlane()

  // Track which buffer is currently visible
  let activeBuffer = frontBuffer
  let hiddenBuffer = backBuffer

  // Calculate and apply scale based on aspect ratio
  const calculateScale = (bufferObj: any) => {
    const { mesh } = bufferObj
    const scale = VIDEO_BACKGROUND_CONFIG.position.scale
    const windowAspect = window.innerWidth / window.innerHeight
    const videoAspect = 16 / 9

    if (windowAspect > videoAspect) {
      // Wider window - scale to width
      mesh.scale.set(
        scale * (windowAspect / videoAspect),
        scale,
        1,
      )
    } else {
      // Taller window - scale to height
      mesh.scale.set(
        scale,
        scale * (videoAspect / windowAspect),
        1,
      )
    }
  }

  // Set initial scale for both buffers
  calculateScale(frontBuffer)
  calculateScale(backBuffer)

  // Update scale on window resize
  const handleResize = () => {
    calculateScale(frontBuffer)
    calculateScale(backBuffer)
  }

  window.addEventListener('resize', handleResize)

  // Helper to seek to random position in video
  const seekToRandomPosition = (video: HTMLVideoElement) => {
    if (video.duration) {
      try {
        // Seek to random position between 0 and duration
        // But avoid the very beginning and end of the video where glitches might occur
        const safeMargin = 0.1 // 10% safety margin
        const usableDuration = video.duration * (1 - 2 * safeMargin)
        const randomTime = (safeMargin * video.duration) + (Math.random() * usableDuration)

        // Ensure the time is valid
        const seekTime = Math.min(Math.max(randomTime, 0), video.duration - 0.5)
        video.currentTime = seekTime
      } catch (error) {
        console.warn('Error during video seek:', error)
      }
    }
  }

  // Helper to load a single video
  const loadVideo = async (path: string) => {
    try {
      console.log(`Attempting to load video: ${path}`)

      // Create a test request to check if the file exists
      try {
        const response = await fetch(path, { method: 'HEAD' })
        if (!response.ok) {
          console.warn(`Video not found (404): ${path}`)
          return false
        }
      } catch (error) {
        console.warn(`Network error checking video: ${path}`, error)
        return false
      }

      // Create a properly prepared video
      return new Promise((resolve) => {
        const video = document.createElement('video')
        video.crossOrigin = 'anonymous'
        video.loop = true
        video.muted = true
        video.playsInline = true
        video.autoplay = true
        video.preload = 'auto'

        // Create texture from video
        const texture = new THREE.VideoTexture(video)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBAFormat

        // Add them to our arrays
        const videoIndex = videos.length
        videos.push(video)
        videoTextures.push(texture)

        // Set up event listeners
        video.addEventListener('loadeddata', () => {
          console.log(`Video ${videoIndex} data loaded`)

          // Only seek if configured to do so
          if (VIDEO_BACKGROUND_CONFIG.cycling.randomStart) {
            // Seek to random position
            seekToRandomPosition(video)

            // Wait for seeking to complete
            video.addEventListener('seeked', () => {
              console.log(`Video ${videoIndex} seeked to random position`)

              // Mark this video as fully ready
              video.dataset.ready = 'true'
              resolve(true)
            }, { once: true })
          } else {
            // If not seeking, mark as ready immediately
            video.dataset.ready = 'true'
            resolve(true)
          }
        })

        // Check for errors
        video.addEventListener('error', (e) => {
          console.error(`Video ${videoIndex} error:`, e)
          resolve(false)
        })

        // Set source and load
        video.src = path
        video.load()

        // Ensure it starts playing
        video.play().catch((e) => {
          console.warn(`Failed to play video ${videoIndex}:`, e)
          resolve(false)
        })
      })
    } catch (error) {
      console.warn(`Could not load video: ${path}`, error)
      return false
    }
  }

  // Check if a video is ready for switching
  const isVideoReady = (index: number) => {
    const video = videos[index]
    return video && !video.paused && !video.ended && video.dataset.ready === 'true'
  }

  // Prepare the hidden buffer with the next video
  const prepareNextVideo = async (videoIndex: number) => {
    // Make sure the video buffer is correct
    const video = videos[videoIndex]
    if (!video || !isVideoReady(videoIndex)) return false

    // Get the texture
    const texture = videoTextures[videoIndex]

    // Assign to the hidden buffer's material
    hiddenBuffer.material.map = texture
    hiddenBuffer.material.needsUpdate = true

    // Successful preparation
    return true
  }

  // Swap the buffers to show the prepared video
  const swapBuffers = () => {
    // Show the hidden buffer
    hiddenBuffer.material.opacity = currentOpacity
    hiddenBuffer.material.needsUpdate = true

    // Hide the active buffer
    activeBuffer.material.opacity = 0
    activeBuffer.material.needsUpdate = true

    // Swap buffer references
    const temp = activeBuffer
    activeBuffer = hiddenBuffer
    hiddenBuffer = temp

    console.log('Swapped video buffers')
  }

  // Function to load videos from the videos directory
  const loadVideos = async () => {
    try {
      // List of actual videos in the static/videos directory
      const videoFiles = [
        'elementsShift.webm',
        'mechanicalOctupus.webm',
        'movingStructures.webm',
        'movingStructures2.webm',
        'cosmicHorror.webm',
        'glitchy.webm',
        'moveForward.webm',
        'glitchyStructures.webm',
        'cosmicFractals.webm',
        'cosmicFolds.webm',
        'ghastlyLandscape.webm',
      ]

      // Try different base paths in case the configured one doesn't work
      const possiblePaths = [
        VIDEO_BACKGROUND_CONFIG.videos.path,
        '/static/videos/',
        'static/videos/',
        '../static/videos/',
        './static/videos/',
        '/videos/',
        'videos/',
      ]

      // Shuffle the array to randomize initial order
      const shuffledVideos = [...videoFiles].sort(() => Math.random() - 0.5)

      // Try loading videos from different paths until we find one that works
      let loadedAnyVideos = false

      for (const basePath of possiblePaths) {
        console.log(`Trying video path: ${basePath}`)
        let loadedFromThisPath = false

        // Try loading at least one video from this path
        if (await loadVideo(`${basePath}${shuffledVideos[0]}`)) {
          loadedFromThisPath = true
          loadedAnyVideos = true

          // If successful, load the rest of the videos from this path
          for (let i = 1; i < shuffledVideos.length; i++) {
            await loadVideo(`${basePath}${shuffledVideos[i]}`)
          }

          console.log(`Successfully loaded videos from path: ${basePath}`)
          break // Stop trying other paths
        }
      }

      if (!loadedAnyVideos) {
        console.error('Failed to load any videos from any paths')
        return
      }

      // Set up initial video on the active buffer
      if (videos.length > 0 && videoTextures.length > 0) {
        // Choose a random video to start with
        currentVideoIndex = Math.floor(Math.random() * videos.length)

        // Set initial texture on active buffer
        activeBuffer.material.map = videoTextures[currentVideoIndex]
        activeBuffer.material.opacity = currentOpacity
        activeBuffer.material.needsUpdate = true

        console.log(`Initial video set to ${currentVideoIndex}`)

        // Prepare next video on hidden buffer
        if (videos.length > 1) {
          do {
            nextVideoIndex = Math.floor(Math.random() * videos.length)
          } while (nextVideoIndex === currentVideoIndex)

          await prepareNextVideo(nextVideoIndex)
        }
      } else {
        console.warn('No videos could be loaded from the specified directory')
      }
    } catch (error) {
      console.error('Error loading video backgrounds:', error)
    }
  }

  // Update function called every frame
  const update = (delta: number) => {
    if (!VIDEO_BACKGROUND_CONFIG.enabled || videos.length < 2) return

    // Check if it's time to switch videos
    timeSinceLastSwitch += delta

    if (timeSinceLastSwitch >= switchDuration) {
      // Swap buffers to show the already-prepared video
      swapBuffers()

      // Update current video index
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

      // Try to find a ready video that's different from the current one
      while (!foundNext && attempts < maxAttempts) {
        // Select a random video
        const candidateIndex = Math.floor(Math.random() * videos.length)

        // Check if it's different and ready
        if (candidateIndex !== currentVideoIndex && isVideoReady(candidateIndex)) {
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

  // Dispose function to clean up resources
  const dispose = () => {
    // Remove event listeners
    window.removeEventListener('resize', handleResize)

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
