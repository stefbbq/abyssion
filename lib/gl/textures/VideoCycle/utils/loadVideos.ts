import * as THREE from 'three'
import { lc, log } from '@lib/logger/index.ts'
import { VIDEO_CYCLE_CONFIG } from '../config.ts'
import { loadVideo } from './loadVideo.ts'

/**
 * Loads videos from the videos directory using manifest
 *
 * Fetches the manifest.json file and attempts to load each video,
 * returning arrays of successfully loaded videos and their textures
 */
export const loadVideos = async (): Promise<{
  videos: HTMLVideoElement[]
  videoTextures: THREE.VideoTexture[]
}> => {
  const videos: HTMLVideoElement[] = []
  const videoTextures: THREE.VideoTexture[] = []

  try {
    log(lc.GL_TEXTURES, 'Loading video backgrounds...')
    const manifestPath = `${VIDEO_CYCLE_CONFIG.videos.path}manifest.json`
    let videoFiles: string[] = []

    try {
      const response = await fetch(manifestPath)

      if (!response.ok) throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`)

      const manifest = await response.json()

      if (Array.isArray(manifest)) {
        videoFiles = manifest.map((video: any) => {
          if (typeof video === 'string') return video
          else if (video && video.file) return video.file
          return null
        }).filter(Boolean)
      }
    } catch (error) {
      console.error('Error loading video manifest:', error)
    }

    if (videoFiles.length === 0) {
      console.warn('No video files found in manifest')
      return { videos, videoTextures }
    }

    log(lc.GL_TEXTURES, `Found ${videoFiles.length} videos in manifest`)

    // Try to load each video
    for (const file of videoFiles) {
      const videoPath = `${VIDEO_CYCLE_CONFIG.videos.path}${file}`
      log(lc.GL_TEXTURES, `Attempting to load video: ${videoPath}`)

      const { video, texture, success } = await loadVideo(videoPath)

      if (success && texture) {
        videos.push(video)
        videoTextures.push(texture)
      }
    }

    log(lc.GL_TEXTURES, `Successfully loaded ${videos.length} of ${videoFiles.length} videos`)

    if (videos.length === 0) console.error('Failed to load any videos from any paths')
  } catch (error) {
    log.error(lc.GL_TEXTURES, 'Error loading video backgrounds:', error)
  }

  return { videos, videoTextures }
}
