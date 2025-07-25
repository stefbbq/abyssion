import * as Three from 'three'

// =============================================================================
// CORE VIDEO CYCLE TYPES
// =============================================================================

/**
 * Video pool management state containing exactly 3 video elements
 * that rotate through active, next, and backup roles
 */
export type VideoPoolState = {
  /** Currently visible and playing video element */
  active: HTMLVideoElement | null
  /** Prepared and ready for seamless transition */
  next: HTMLVideoElement | null
  /** Available for next preparation */
  backup: HTMLVideoElement | null
}

/**
 * Video metadata and loading state information
 * Contains all information about a single video in the manifest
 */
export type VideoInfo = {
  /** Index position in the video manifest */
  index: number
  /** Filename of the video file */
  filename: string
  /** Full URL path to the video file */
  url: string
  /** Whether the video has been successfully loaded */
  loaded: boolean
  /** Duration of the video in seconds */
  duration: number
  /** Reference to the HTML video element, null if not loaded */
  element: HTMLVideoElement | null
}

/**
 * Current playback state including timing and transition status (legacy version)
 * Tracks the active video segment and playback progress
 * @deprecated This is the legacy version used by existing code
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
 * New playback state design for pure functional implementation
 * Tracks the active video segment and playback progress
 */
export type NewPlaybackState = {
  /** Index of currently playing video in manifest */
  currentVideoIndex: number
  /** Start time of current video segment in seconds */
  currentStartTime: number
  /** Duration of current video segment in seconds */
  currentDuration: number
  /** Current playback time within the video */
  currentVideoTime: number
  /** Whether video playback is currently active */
  isPlaying: boolean
  /** Whether system is transitioning between videos */
  isTransitioning: boolean
}

/**
 * Loading progress tracking for all videos in manifest
 * Provides comprehensive status of video loading operations
 */
export type LoadingProgress = {
  /** Total number of videos in manifest */
  totalVideos: number
  /** Number of successfully loaded videos */
  loadedVideos: number
  /** Array of filenames currently being loaded */
  currentlyLoading: string[]
  /** Array of filenames that failed to load */
  failedVideos: string[]
  /** Whether system has minimum videos needed for playback */
  readyForPlayback: boolean
}

/**
 * Complete video cycle system configuration
 * Matches the structure of configVideoCycle.json
 */
export type VideoCycleConfig = {
  /** Whether the video cycle system is enabled */
  enabled: boolean
  /** Video cycling behavior settings */
  cycling: {
    /** Minimum segment length in seconds */
    minSegmentLength: number
    /** Maximum segment length in seconds */
    maxSegmentLength: number
    /** Video playback speed multiplier */
    playbackSpeed: number
    /** Number of recent videos to avoid repeating */
    antiRepeat: number
    /** Timeout for video transitions in milliseconds */
    videoSwapTimeoutMs: number
    /** Timeout for video loading in milliseconds */
    videoLoadTimeoutMs: number
  }
  /** Visual appearance settings */
  appearance: {
    /** Video opacity (0-1) */
    opacity: number
  }
  /** 3D positioning settings */
  position: {
    /** Z-axis position in 3D space */
    z: number
    /** Scale factor for video plane */
    scale: number
  }
  /** Video file path configuration */
  videos: {
    /** Base path to video files */
    path: string
  }
}

// =============================================================================
// PURE FUNCTION INPUT/OUTPUT TYPES
// =============================================================================

/**
 * Input parameters for buffer state calculations
 * Used to determine when to prepare next video and transition
 */
export type BufferStateInput = {
  /** Start time of current video segment */
  currentStartTime: number
  /** Duration of current video segment */
  currentDuration: number
  /** Current playback time within the video */
  currentVideoTime: number
  /** Progress threshold (0-1) that triggers transition preparation */
  transitionTriggerPoint: number
  /** Whether the next video is prepared and ready */
  isNextVideoPrepared: boolean
}

/**
 * Result of buffer state calculations
 * Indicates when to prepare next video and when to transition
 */
export type BufferState = {
  /** Whether system should start preparing the next video */
  shouldPrepareNext: boolean
  /** Whether system should transition to the next video */
  shouldTransition: boolean
  /** Current playback progress as percentage (0-1) */
  playbackProgress: number
  /** Time remaining in current segment in seconds */
  timeRemaining: number
}

/**
 * Input parameters for video selection algorithm
 * Used to choose next video while avoiding recent repeats
 */
export type VideoSelectionInput = {
  /** Index of currently playing video */
  currentIndex: number
  /** Array of recently played video indices */
  recentIndices: readonly number[]
  /** Array of all available video filenames */
  manifest: readonly string[]
  /** Base path for constructing video URLs */
  basePath: string
  /** Number of recent videos to avoid repeating */
  antiRepeatCount: number
}

/**
 * Result of video selection algorithm
 * Contains the chosen video information
 */
export type VideoSelection = {
  /** Index of selected video in manifest */
  index: number
  /** Filename of selected video */
  filename: string
  /** Full URL to selected video */
  url: string
}

/**
 * Input parameters for video readiness calculations
 * Used to determine system readiness for playback
 */
export type ReadinessInput = {
  /** Array of all video information with loading status */
  loadedVideos: VideoInfo[]
  /** Minimum number of videos required to start playback */
  minimumVideosRequired: number
  /** Array of filenames currently being loaded */
  currentlyLoading: string[]
}

/**
 * Result of video readiness calculations
 * Indicates system readiness and next actions
 */
export type ReadinessState = {
  /** Whether system is ready to begin video playback */
  isReadyForPlayback: boolean
  /** Whether system can start video transitions */
  canStartTransitions: boolean
  /** Next video filename to load, null if none needed */
  nextVideoToLoad: string | null
  /** Overall loading progress as percentage (0-1) */
  loadingProgress: number
}

// =============================================================================
// DEBUG INFORMATION TYPES
// =============================================================================

/**
 * Input parameters for debug information generation
 * Contains all state needed to generate comprehensive debug output
 */
export type DebugInfoInput = {
  /** Current playback state with timing and video information */
  playbackState: NewPlaybackState
  /** Loading progress for all videos in manifest */
  loadingProgress: LoadingProgress
  /** Current video pool state with active/next/backup videos */
  videoPoolState: VideoPoolState
  /** Array of all video information with loading status */
  videoInfos: VideoInfo[]
  /** System configuration settings */
  config: VideoCycleConfig
  /** Array of recently played video indices */
  recentVideoIndices: number[]
  /** Whether system is currently transitioning between videos */
  isTransitioning: boolean
  /** Time elapsed since last video switch in milliseconds */
  timeSinceSwitch: number
}

// =============================================================================
// ORCHESTRATOR AND MANAGER TYPES
// =============================================================================

/**
 * Main video cycle manager interface
 * Coordinates all video cycle operations and provides public API
 */
export type VideoCycleManager = {
  // State access methods
  /** Get current playback state */
  getPlaybackState: () => NewPlaybackState
  /** Get current loading progress */
  getLoadingProgress: () => LoadingProgress
  /** Get formatted debug information string */
  getDebugInfo: () => string
  /** Get debug information as structured object */
  getDebugInfoObject: () => import('@libgl/types.ts').VideoDebugInfo

  // Control methods
  /** Start the video cycle system */
  start: () => Promise<void>
  /** Stop video playback */
  stop: () => void
  /** Clean up all resources and event listeners */
  cleanup: () => void

  // Video pool access
  /** Get currently active video element */
  getActiveVideo: () => HTMLVideoElement | null

  // Telemetry and analysis methods
  /** Export comprehensive telemetry data for analysis */
  getTelemetryData?: () => ReturnType<import('./utils/createTelemetryCollector.ts').TelemetryCollector['exportTelemetryData']>
  /** Get performance analysis and health recommendations */
  getPerformanceAnalysis?: () => ReturnType<import('./utils/createTelemetryCollector.ts').TelemetryCollector['analyzePerformance']>
  /** Get current performance metrics */
  getTelemetryMetrics?: () => import('./utils/createTelemetryCollector.ts').PerformanceMetrics
}

// =============================================================================
// LEGACY COMPATIBILITY TYPES (for existing code)
// =============================================================================

/**
 * Represents a video pool for efficient memory management (legacy version)
 * Contains 2-3 video elements that dynamically load different sources
 * @deprecated Use VideoPoolState for new implementations
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
 * Represents the manifest of available video files (legacy version)
 * Contains metadata about all videos that can be loaded
 * @deprecated Use string[] manifest with separate basePath for new implementations
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
 * Represents a video element paired with its corresponding Three.js texture
 * Used for video playback in WebGL context
 * @deprecated Use VideoInfo and separate texture management instead
 */
export type VideoTexture = {
  /** The HTML video element containing the video data */
  video: HTMLVideoElement
  /** The Three.js texture created from the video element */
  texture: Three.VideoTexture
}

/**
 * Result of an asynchronous video loading operation
 * Contains video element, texture, and success status
 * @deprecated Use VideoInfo with loading status instead
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
 * @deprecated Will be replaced by new video pool management system
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
