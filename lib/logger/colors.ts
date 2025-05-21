import { LogContext, LogLevel } from './constants.ts'

const baseStyle = 'padding: 2px 6px; border-radius: 3px; font-weight: bold;'

/**
 * Maps each LogContext to a CSS style string for console prefix coloring.
 */
export const CONTEXT_COLORS: Record<LogContext, string> = {
  [LogContext.GL]: `${baseStyle} background: #1e90ff; color: white;`, // DodgerBlue
  [LogContext.GL_VIDEO]: `${baseStyle} background: #00ced1; color: white;`, // DarkTurquoise
  [LogContext.GL_ANIMATION]: `${baseStyle} background: #20b2aa; color: white;`, // LightSeaGreen
  [LogContext.GL_SCENE]: `${baseStyle} background: #3cb371; color: white;`, // MediumSeaGreen
  [LogContext.GL_CONTROLS]: `${baseStyle} background: #48d1cc; color: white;`, // MediumTurquoise
  [LogContext.GL_GEOMETRY]: `${baseStyle} background: #00fa9a; color: black;`, // MediumSpringGreen
  [LogContext.GL_SHADERS]: `${baseStyle} background: #87cefa; color: black;`, // LightSkyBlue
  [LogContext.GL_TEXTURES]: `${baseStyle} background: #636363; color: white;`, // DarkGray
  [LogContext.PREACT]: `${baseStyle} background: #777; color: white;`, // Darker Gray
}

/**
 * Maps each LogLevel to a CSS style string for message coloring.
 */
export const LOG_LEVEL_STYLES: Record<LogLevel, string> = {
  trace: 'color: #800080;', // Purple
  debug: 'color: #0000FF;', // Blue
  info: 'color: #008000;', // Green
  warn: 'color: #FFA500;', // Orange
  error: 'color: #FF0000; font-weight: bold;', // Red, bold
  critical: 'color: #FF0000; font-weight: bold; text-decoration: underline;', // Red, bold, underline
  off: '',
}
