/**
 * Supported log levels for the logger utility.
 *
 * - 'trace': Very fine-grained (diagnostic) logging, mapped to console.debug.
 * - 'debug': Debug-level logging, mapped to console.debug.
 * - 'info': Informational messages, mapped to console.log.
 * - 'warn': Warnings, mapped to console.warn.
 * - 'error': Errors, mapped to console.error.
 * - 'critical': Critical errors, mapped to console.error with special styling.
 * - 'off': Disable logging.
 */
export const LOG_LEVELS = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'critical',
  'off',
] as const

// Type for log levels
export type LogLevel = typeof LOG_LEVELS[number]

/**
 * LogContext defines the available logging prefixes for categorizing log output.
 * Each context provides a semantic grouping and a unique color/style in the logger.
 *
 * - GL: General WebGL or rendering context.
 * - GL_VIDEO: Video texture or video-related GL operations.
 * - GL_ANIMATION: Animation loop, frame, or timing context.
 * - GL_SCENE: Scene graph or scene management operations.
 * - GL_CONTROLS: User input, camera, or control events.
 * - GL_GEOMETRY: Geometry, mesh, or shape construction.
 * - GL_SHADERS: Shader compilation, linking, or usage.
 * - PREACT: Preact/component frontend context.
 */
export enum LogContext {
  GL = 'gl',
  GL_VIDEO = 'gl/video',
  GL_ANIMATION = 'gl/animation',
  GL_SCENE = 'gl/scene',
  GL_CONTROLS = 'gl/controls',
  GL_GEOMETRY = 'gl/geometry',
  GL_SHADERS = 'gl/shaders',
  GL_TEXTURES = 'gl/textures',
  PREACT = 'preact',
}
