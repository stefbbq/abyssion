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
  // whether the video is transitioning between videos
  isTransitioning: boolean

  // Current video information
  currentVideoIndex: number // number in the manifest
  currentVideoName: string // name of the current video
  currentVideoSrc: string // source of the current video
  currentDuration: number // in seconds (visible segment duration)
  currentStartTime: number // in seconds (where the visible segment starts)
  currentSegmentEndTime: number // in seconds (where the visible segment ends)
  fullVideoDuration: number // in seconds (actual video file duration)

  // Timing information
  timeSinceSwitch: number // in milliseconds
  segmentProgressPercent: number // 0-100 percent through current segment
  nextVideoTriggerTime: number // absolute timestamp when next video will trigger
  timeUntilNextVideo: number // milliseconds until next video triggers
  bufferSwapTime: number // absolute timestamp when buffers will swap
  timeUntilBufferSwap: number // milliseconds until buffer swap

  // Next video information
  nextPreparedIndex: number | null // index of the next prepared video
  nextPreparedVideoName: string | null // name of the next prepared video
  nextPreparedVideoSrc: string | null // source of the next prepared video
  nextVideoStartTime: number | null // start time for next video segment
  nextVideoDuration: number | null // duration for next video segment
  nextVideoFullDuration: number | null // full duration of next video file

  // History and anti-repeat
  recentIndices: readonly number[] // recent indices of the videos
  antiRepeatCount: number // how many videos are blocked by anti-repeat

  // Buffer states
  activeBuffer: {
    name: string // 'front' or 'back'
    opacity: number // current opacity value
    videoIndex: number | null // which video is in this buffer
    videoName: string | null // name of video in this buffer
  }
  hiddenBuffer: {
    name: string // 'front' or 'back'
    opacity: number // current opacity value
    videoIndex: number | null // which video is in this buffer
    videoName: string | null // name of video in this buffer
  }

  // Pool and loading information
  totalVideos: number // total number of videos in the manifest
  loadingProgress: VideoCycleLoadingProgress
  poolSize: number // number of videos currently loaded in pool
  manifestRemaining: number // number of videos not yet loaded
}

export type VideoCycleLoadingProgress = {
  // number of videos loaded
  loaded: number
  // total number of videos in the manifest
  total: number
  // whether there are more videos to load
  hasMoreToLoad: boolean
}
