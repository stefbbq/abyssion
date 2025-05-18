/**
 * Shader types
 */

import type { Color, Texture } from 'three'

// Shader material parameters
export type ShaderParams = {
  texture: Texture
  color: Color
  opacity: number
  noiseScale: number
  noiseOffset: number
  isStencil?: boolean
} 