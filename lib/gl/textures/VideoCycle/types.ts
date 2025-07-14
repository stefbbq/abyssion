import * as Three from 'three'

/**
 * Represents a video element paired with its corresponding Three.js texture
 * Used for video playback in WebGL context
 */
export type VideoTexture = {
  /** The HTML video element containing the video data */
  video: HTMLVideoElement
  /** The Three.js texture created from the video element */
  texture: Three.VideoTexture
}

/**
 * Represents a video pool for efficient memory management
 * Contains 2-3 video elements that dynamically load different sources
 */
export type VideoPool = {
  /** The video elements in the pool */
  videos: readonly HTMLVideoElement[]
  /** The textures for each video element */
  textures: readonly Three.VideoTexture[]
  /** Current active video index in pool */
  activeIndex: number
  /** Next video index in pool */
  nextIndex: number
  /** Backup video index in pool */
  backupIndex: number
}

/**
 * Represents the manifest of available video files
 * Contains metadata about all videos that can be loaded
 */
export type VideoManifest = {
  /** Array of video filenames */
  files: readonly string[]
  /** Base path for video files */
  basePath: string
  /** Total number of videos */
  totalCount: number
}

/**
 * Tracks the current state of video playback including timing and history
 * Used to manage video transitions and prevent repetition
 */
export type PlaybackState = {
  /** Video manifest containing all available videos */
  readonly manifest: VideoManifest
  /** Video pool for efficient memory management */
  readonly videoPool: VideoPool
  /** Index of the currently playing video in manifest */
  readonly currentManifestIndex: number
  /** Indices of recently played videos to avoid repetition */
  readonly recentIndices: readonly number[]
  /** Time elapsed since last video switch in milliseconds */
  readonly timeSinceSwitch: number
  /** Duration of current video in seconds */
  readonly currentDuration: number
  /** Start time of current video segment */
  readonly currentStartTime: number
  /** Whether video playback is currently active */
  readonly isPlaying: boolean
  /** Whether next video is prepared for transition */
  readonly isNextVideoPrepared: boolean
}

/**
 * Result of an asynchronous video loading operation
 * Contains video element, texture, and success status
 */
export type VideoLoadResult = {
  /** The loaded HTML video element, null if loading failed */
  readonly video: HTMLVideoElement | null
  /** The created Three.js texture, null if loading failed */
  readonly texture: Three.VideoTexture | null
  /** Whether the load was successful */
  readonly success: boolean
}

/**
 * Represents a video buffer object in the Three.js scene
 * Contains mesh, material and timing information for video playback
 */
export type BufferObject = {
  /** The Three.js mesh displaying the video */
  mesh: Three.Mesh
  /** Material used for video rendering */
  material: Three.MeshBasicMaterial
  /** Geometry defining the video plane */
  geometry: Three.PlaneGeometry
  /** Planned start time for video playback */
  _plannedStartTime?: number
  /** Planned duration for video playback */
  _plannedDuration?: number
  /** Index of video to be played */
  _plannedVideoIndex?: number
  /** Actual time when playback started */
  _playStartTime?: number
}
