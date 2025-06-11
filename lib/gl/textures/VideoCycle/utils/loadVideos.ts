import * as Three from 'three'
import { lc, log } from '@lib/logger/index.ts'
import videoCycleConfig from '@libgl/configVideoCycle.json' with { type: 'json' }
import { loadVideo } from './loadVideo.ts'

/**
 * Loads videos from the videos directory using manifest
 *
 * Loads just 2 videos initially to start cycling immediately,
 * then provides a function to load one more video at a time
 */
export const loadVideos = async (): Promise<{
  videos: HTMLVideoElement[]
  videoTextures: Three.VideoTexture[]
  loadNextVideo: () => Promise<{ video: HTMLVideoElement | null; texture: Three.VideoTexture | null }>
  hasMoreVideos: () => boolean
}> => {
  const { videos: { path: videosPath } } = videoCycleConfig
  const videos: HTMLVideoElement[] = []
  const videoTextures: Three.VideoTexture[] = []
  let loadedCount = 0

  try {
    log(lc.GL_TEXTURES, 'Loading video backgrounds...')
    const manifestPath = `${videosPath}manifest.json`
    let videoFiles: string[] = []

    try {
      const response = await fetch(manifestPath)

      if (!response.ok) throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`)

      const manifest = await response.json()

      if (Array.isArray(manifest)) {
        videoFiles = manifest
          .map((video: string | { file: string } | null) => {
            if (typeof video === 'string') return video
            else if (video && video.file) return video.file
            return null
          })
          .filter((file): file is string => Boolean(file))
      }
    } catch (error) {
      log.error(lc.GL_VIDEO, 'Error loading video manifest:', error)
      return {
        videos,
        videoTextures,
        loadNextVideo: async () => ({ video: null, texture: null }),
        hasMoreVideos: () => false,
      }
    }

    if (videoFiles.length === 0) {
      log.warn(lc.GL_VIDEO, 'No video files found in manifest')
      return {
        videos,
        videoTextures,
        loadNextVideo: async () => ({ video: null, texture: null }),
        hasMoreVideos: () => false,
      }
    }

    log(lc.GL_TEXTURES, `Found ${videoFiles.length} videos in manifest`)

    // Load exactly 2 videos initially - no more, no less
    const INITIAL_LOAD_COUNT = Math.min(2, videoFiles.length)

    for (let i = 0; i < INITIAL_LOAD_COUNT; i++) {
      const file = videoFiles[i]
      const videoPath = `${videosPath}${file}`
      log.trace(lc.GL_TEXTURES, `Loading initial video ${i + 1}/${INITIAL_LOAD_COUNT}: ${videoPath}`)

      const { video, texture, success } = await loadVideo(videoPath)

      if (success && texture) {
        videos.push(video)
        videoTextures.push(texture)
        loadedCount++
        log.trace(lc.GL_TEXTURES, `✓ Initial video ${i + 1} loaded successfully`)
      } else {
        log.warn(lc.GL_TEXTURES, `✗ Failed to load initial video ${i + 1}: ${file}`)
      }
    }

    log.trace(lc.GL_TEXTURES, `Initial loading complete: ${videos.length} videos loaded`)

    // Function to load one more video at a time
    const loadNextVideo = async () => {
      if (loadedCount >= videoFiles.length) {
        return { video: null, texture: null }
      }

      const file = videoFiles[loadedCount]
      const videoPath = `${videosPath}${file}`
      log.trace(lc.GL_TEXTURES, `Loading next video: ${videoPath}`)

      const { video, texture, success } = await loadVideo(videoPath)
      loadedCount++

      if (success && texture) {
        videos.push(video)
        videoTextures.push(texture)
        log.trace(lc.GL_TEXTURES, `✓ Next video loaded successfully: ${file}`)
        return { video, texture }
      } else {
        log.warn(lc.GL_TEXTURES, `✗ Failed to load next video: ${file}`)
        return { video: null, texture: null }
      }
    }

    const hasMoreVideos = () => loadedCount < videoFiles.length

    if (videos.length === 0) {
      log.error(lc.GL_VIDEO, 'Failed to load any videos from any paths')
    }

    return { videos, videoTextures, loadNextVideo, hasMoreVideos }
  } catch (error) {
    log.error(lc.GL_TEXTURES, 'Error loading video backgrounds:', error)
  }

  return {
    videos,
    videoTextures,
    loadNextVideo: async () => ({ video: null, texture: null }),
    hasMoreVideos: () => false,
  }
}
