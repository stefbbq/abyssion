/**
 * @module LogoLayer
 *
 * Main entry point for logo layer rendering functionality.
 * Coordinates with utils to generate logo layers.
 */

import * as Three from 'three'
import { getAllLogoLayers } from './utils/getAllLogoLayers.ts'
import { createPlanesFromLayers } from './utils/createPlanesFromLayers.ts'
import { recreateRandomLogoLayers } from './utils/recreateRandomLogoLayers.ts'
import { disposeLogoLayers } from './utils/disposeLayers.ts'

/**
 * configuration for a single layer in a 3D logo visualization
 * defines visual appearance, depth positioning and animation behavior
 */
export type LogoLayer = {
  /** when true, this layer will act as a mask for layers below it in the stack */
  isStencil: boolean
  /** rgb color values, each component normalized between 0-1 */
  color: { r: number; g: number; b: number }
  /** transparency level from 0 (fully transparent) to 1 (fully opaque) */
  opacity: number
  /** position along the z-axis in 3D space, controls layer stacking depth */
  zPos: number
  /** determines the density/frequency of the noise pattern (higher = more detailed) */
  noiseScale: number
  /** starting position in the noise space, affects the initial pattern appearance */
  noiseOffset: number
  /** speed multiplier for noise animation, higher values create faster movement */
  noiseRate: number
  /** animation frame rate for this specific layer, independent of other layers */
  fps: number
  /** when true, initializes the layer with randomized noise parameters */
  isRandom: boolean
}

/**
 * Creates and manages the core logo layer system
 * Returns a single object with all necessary methods for working with layers
 */
export const createLogoLayer = (THREE: typeof Three) => {
  return {
    /**
     * Get all layers (static + random)
     */
    getAllLayers: () => getAllLogoLayers(THREE),

    /**
     * Create plane meshes from layers
     */
    createPlanes: (
      layers: LogoLayer[],
      planeGeometry: Three.PlaneGeometry,
      outlineTexture: Three.Texture,
      stencilTexture: Three.Texture,
      scene: Three.Scene,
    ) =>
      createPlanesFromLayers(
        THREE,
        layers,
        planeGeometry,
        outlineTexture,
        stencilTexture,
        scene,
      ),

    /**
     * Clean up and regenerate all random layers
     */
    regenerate: (
      scene: Three.Scene,
      currentPlanes: Three.Mesh[],
      planeGeometry: Three.PlaneGeometry,
      outlineTexture: Three.Texture,
      stencilTexture: Three.Texture,
    ) =>
      recreateRandomLogoLayers(
        THREE,
        scene,
        currentPlanes,
        planeGeometry,
        outlineTexture,
        stencilTexture,
      ),

    /**
     * Dispose of all layer meshes
     */
    dispose: (scene: Three.Scene, planes: Three.Mesh[]) => disposeLogoLayers(scene, planes),
  }
}
