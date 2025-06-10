/**
 * @module ShadowLayer
 *
 * Creates an elliptical gradient shadow behind the logo
 */

import * as Three from 'three'
import type { Mesh } from 'three'
import { getBaselineDimensions } from '@lib/gl/scene/utils/getBaselineDimensions.ts'
import { shadowFragmentShader, shadowVertexShader } from '@libgl/shaders/ShadowShader.ts'

// Shadow layer type
export type ShadowLayer = {
  // The mesh containing the shadow
  mesh: Mesh
  // Dispose of the shadow layer
  dispose: () => void
}

/**
 * Create a gradient shadow layer behind the logo with responsive sizing
 */
export const createShadowLayer = (THREE: typeof Three, logoWidth?: number, logoHeight?: number): ShadowLayer | null => {
  // Get responsive dimensions if not provided
  const { planeWidth, planeHeight } = getBaselineDimensions()

  // Calculate shadow dimensions and setup
  const actualLogoWidth = logoWidth || planeWidth
  const actualLogoHeight = logoHeight || planeHeight
  const shadowWidth = actualLogoWidth * 2.4
  const shadowHeight = actualLogoHeight * .8
  const geometry = new THREE.PlaneGeometry(shadowWidth, shadowHeight)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      opacity: { value: .7 },
    },
    vertexShader: shadowVertexShader,
    fragmentShader: shadowFragmentShader,
    transparent: true,
    depthWrite: false,
  })

  const shadowMesh = new THREE.Mesh(geometry, material)
  shadowMesh.position.z = -0.1

  return {
    mesh: shadowMesh,
    dispose: () => {
      geometry.dispose()
      material.dispose()
    },
  }
}
