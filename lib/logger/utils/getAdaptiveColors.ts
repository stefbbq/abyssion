import { LogContext, LogLevel } from '../constants.ts'
import { detectDarkMode } from './detectTheme.ts'

const baseStyle = 'padding: 2px 6px; border-radius: 3px; font-weight: bold;'

/**
 * Context colors for dark mode (current defaults work well)
 */
const DARK_CONTEXT_COLORS: Record<LogContext, string> = {
  [LogContext.GL]: `${baseStyle} background: #1e90ff; color: white;`,
  [LogContext.GL_VIDEO]: `${baseStyle} background: #00ced1; color: white;`,
  [LogContext.GL_ANIMATION]: `${baseStyle} background: #20b2aa; color: white;`,
  [LogContext.GL_SCENE]: `${baseStyle} background: #3cb371; color: white;`,
  [LogContext.GL_CONTROLS]: `${baseStyle} background: #48d1cc; color: white;`,
  [LogContext.GL_GEOMETRY]: `${baseStyle} background: #00fa9a; color: black;`,
  [LogContext.GL_SHADERS]: `${baseStyle} background: #87cefa; color: black;`,
  [LogContext.GL_TEXTURES]: `${baseStyle} background: #636363; color: white;`,
  [LogContext.PREACT]: `${baseStyle} background: #777; color: white;`,
}

/**
 * Context colors for light mode (adjusted for better visibility)
 */
const LIGHT_CONTEXT_COLORS: Record<LogContext, string> = {
  [LogContext.GL]: `${baseStyle} background: #0066cc; color: white;`, // Darker blue
  [LogContext.GL_VIDEO]: `${baseStyle} background: #008b8b; color: white;`, // Darker turquoise
  [LogContext.GL_ANIMATION]: `${baseStyle} background: #2e8b57; color: white;`, // Darker sea green
  [LogContext.GL_SCENE]: `${baseStyle} background: #228b22; color: white;`, // Forest green
  [LogContext.GL_CONTROLS]: `${baseStyle} background: #20b2aa; color: white;`, // Darker turquoise
  [LogContext.GL_GEOMETRY]: `${baseStyle} background: #00cc7a; color: white;`, // Darker spring green
  [LogContext.GL_SHADERS]: `${baseStyle} background: #4169e1; color: white;`, // Royal blue
  [LogContext.GL_TEXTURES]: `${baseStyle} background: #2f4f4f; color: white;`, // Dark slate gray
  [LogContext.PREACT]: `${baseStyle} background: #555; color: white;`, // Darker gray
}

/**
 * Log level styles for dark mode
 */
const DARK_LOG_LEVEL_STYLES: Record<LogLevel, string> = {
  trace: 'color: #888;',
  debug: 'color: #aaa;',
  info: 'color: #ccc;',
  warn: 'color: #ffb347;', // Light orange for dark backgrounds
  error: 'color: #ff6b6b; font-weight: bold;', // Light red
  critical: 'color: #ff6b6b; font-weight: bold; text-decoration: underline;',
  off: '',
}

/**
 * Log level styles for light mode
 */
const LIGHT_LOG_LEVEL_STYLES: Record<LogLevel, string> = {
  trace: 'color: #999;',
  debug: 'color: #666;',
  info: 'color: #333;',
  warn: 'color: #cc6600; font-weight: bold;', // Dark orange for light backgrounds
  error: 'color: #cc0000; font-weight: bold;', // Dark red
  critical: 'color: #cc0000; font-weight: bold; text-decoration: underline;',
  off: '',
}

/**
 * Gets context colors based on current theme
 *
 * @example
 * const colors = getContextColors()
 */
export const getContextColors = (): Record<LogContext, string> => detectDarkMode() ? DARK_CONTEXT_COLORS : LIGHT_CONTEXT_COLORS

/**
 * Gets log level styles based on current theme
 *
 * @example
 * const styles = getLogLevelStyles()
 */
export const getLogLevelStyles = (): Record<LogLevel, string> => detectDarkMode() ? DARK_LOG_LEVEL_STYLES : LIGHT_LOG_LEVEL_STYLES
