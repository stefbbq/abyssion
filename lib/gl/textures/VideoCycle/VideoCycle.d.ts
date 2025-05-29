import * as THREE from 'three'

/**
 * Represents a video element paired with its corresponding Three.js texture
 * Used for video playback in WebGL context
 */
export type VideoTexture = {
  /** The HTML video element containing the video data */
  video: HTMLVideoElement
  /** The Three.js texture created from the video element */
  texture: THREE.VideoTexture
}

/**
 * Tracks the current state of video playback including timing and history
 * Used to manage video transitions and prevent repetition
 */
export type PlaybackState = {
  /** Array of currently loaded video textures */
  readonly videos: VideoTexture[]
  /** Index of the currently playing video */
  readonly currentIndex: number
  /** Indices of recently played videos to avoid repetition */
  readonly recentIndices: readonly number[]
  /** Time elapsed since last video switch in milliseconds */
  readonly timeSinceSwitch: number
  /** Duration of current video in seconds */
  readonly currentDuration: number
  /** Whether video playback is currently active */
  readonly isPlaying: boolean
}

/**
 * Result of an asynchronous video loading operation
 * Both video and texture may be null if loading failed
 */
export type VideoLoadResult = {
  /** The loaded HTML video element, null if loading failed */
  readonly video: HTMLVideoElement | null
  /** The created Three.js texture, null if loading failed */
  readonly texture: THREE.VideoTexture | null
}

/**
 * Handles loading and managing video assets
 * Provides methods for progressive loading of videos
 */
export type VideoLoader = {
  /** Array of loaded HTML video elements */
  readonly videos: HTMLVideoElement[]
  /** Array of created Three.js video textures */
  readonly videoTextures: THREE.VideoTexture[]
  /** Loads the next video in sequence */
  readonly loadNextVideo: () => Promise<VideoLoadResult>
  /** Checks if more videos are available to load */
  readonly hasMoreVideos: () => boolean
}

/**
 * Represents a video buffer object in the Three.js scene
 * Contains mesh, material and timing information for video playback
 */
export type BufferObject = {
  /** The Three.js mesh displaying the video */
  mesh: THREE.Mesh
  /** Material used for video rendering */
  material: THREE.MeshBasicMaterial
  /** Geometry defining the video plane */
  geometry: THREE.PlaneGeometry
  /** Planned start time for video playback */
  _plannedStartTime?: number
  /** Planned duration for video playback */
  _plannedDuration?: number
  /** Index of video to be played */
  _plannedVideoIndex?: number
  /** Actual time when playback started */
  _playStartTime?: number
}
