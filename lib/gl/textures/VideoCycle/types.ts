import * as Three from 'three'
import type { Mesh } from 'three'
import type { VideoPool } from './utils/updateVideoPool.ts'

/**
 * Video cycle manager API type
 */
export type VideoBackgroundManager = {
  // RAF update function
  readonly update: (_delta: number) => void
  // dispose function
  readonly dispose: () => void
  // video texture mesh
  readonly mesh: Mesh
  // handle resize function
  readonly handleResize: () => void
  // update theme colors function in real-time
  readonly updateThemeColors?: () => void
  // get debug information function
  readonly getDebugInfo?: () => VideoCycleDebugInfo
}

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
 * Tracks the current state of video playback including timing and history
 * Used to manage video transitions and prevent repetition
 */
export type PlaybackState = {
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

// Video cycle debug information
export type VideoCycleDebugInfo = {
  // whether a video is playing
  isPlaying: boolean
  // number in the manifest
  currentVideoIndex: number
  // name of the current video
  currentVideoName: string
  // source of the current video
  currentVideoSrc: string
  // time since the last video switch
  timeSinceSwitch: number // in milliseconds
  // duration of the current video
  currentDuration: number // in seconds (visible segment duration)
  // duration of the current video
  fullVideoDuration: number // in seconds (actual video file duration)
  // start time of the current video
  videoStartTime: number // in seconds (where the visible segment starts)
  // total number of videos in the manifest
  totalVideos: number
  // recent indices of the videos
  recentIndices: readonly number[]
  // index of the next prepared video
  nextPreparedIndex: number | null
  // name of the next prepared video
  nextPreparedVideoName: string | null
  // loading progress of the videos
  loadingProgress: VideoCycleLoadingProgress
}

export type VideoCycleLoadingProgress = {
  // number of videos loaded
  loaded: number
  // total number of videos in the manifest
  total: number
  // whether there are more videos to load
  hasMoreToLoad: boolean
}
