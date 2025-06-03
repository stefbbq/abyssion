import * as THREE from 'three'
import videoCycleConfig from '@lib/configVideoCycle.json' with { type: 'json' }
import ms from 'ms'
import { lc, log } from '@lib/logger/index.ts'

/**
 * Loads a video file and creates a Three.js video texture
 *
 * Creates a video element with appropriate settings for WebGL usage,
 * loads the video file, and generates a Three.js texture from it.
 * Includes timeout handling and error management.
 */
export const loadVideo = (path: string): Promise<{
  video: HTMLVideoElement
  texture: THREE.VideoTexture | null
  success: boolean
}> => {
  return new Promise((resolve) => {
    const { cycling: { playbackSpeed } } = videoCycleConfig
    const video = document.createElement('video')

    // Set video attributes
    video.autoplay = false
    video.loop = true
    video.muted = true
    video.crossOrigin = 'anonymous'
    video.playsInline = true
    video.preload = 'auto'
    video.playbackRate = playbackSpeed

    // Create a timeout for loading
    const timeout = setTimeout(() => {
      log.warn(lc.GL_VIDEO, `Video load timed out: ${path}`)
      resolve({
        video,
        texture: null,
        success: false,
      })
    }, ms('10s'))

    // Event handlers
    const handleCanPlay = () => {
      clearTimeout(timeout)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)

      // Create texture
      const texture = new THREE.VideoTexture(video)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.format = THREE.RGBAFormat

      // Set initial video properties
      video.currentTime = 0

      // video.currentTime is set to 0 by default on load or if not specified.
      // The video will be played explicitly by the cycling logic when it becomes active.
      log.trace(lc.GL_TEXTURES, `Video loaded and ready (but not playing): ${path}, readyState=${video.readyState}`)
      resolve({
        video,
        texture,
        success: true,
      })
    }

    const handleError = (error: ErrorEvent) => {
      clearTimeout(timeout)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)

      log.error(lc.GL_VIDEO, `Error loading video: ${path}`, error)
      resolve({
        video,
        texture: null,
        success: false,
      })
    }

    // Set up event listeners and get loadin'
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.src = path
    video.load()
  })
}
