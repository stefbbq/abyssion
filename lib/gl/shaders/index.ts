/**
 * @fileoverview WebGL Shaders Module
 *
 * This module provides custom shader implementations for advanced visual effects
 * in the WebGL rendering pipeline. It includes specialized shaders for logo effects,
 * post-processing, and visual enhancement.
 *
 * @module gl/shaders
 */

import type { Color, Texture } from 'three'

/**
 * Common parameters used across all shader implementations
 *
 * @interface ShaderParams
 * @description Defines the standard parameter structure for shader uniforms
 */
export type ShaderParams = {
  /** The texture to be processed by the shader */
  texture: Texture
  /** Base color for shader effects */
  color: Color
  /** Opacity level (0.0 to 1.0) */
  opacity: number
  /** Scale factor for noise generation */
  noiseScale: number
  /** Offset value for noise patterns */
  noiseOffset: number
  /** Optional flag to enable stencil buffer usage */
  isStencil?: boolean
}

export * from './ElectricShader.ts'
export * from './DitheringShader.ts'
export * from './SharpeningShader.ts'
