import * as Three from 'three'
import { createLogoPlaneGeometry } from '@libgl/scene/createLogoPlaneGeometry.ts'
import { createLogoLayer } from '@libgl/layers/index.ts'
import { createGeometricLayer } from '@libgl/layers/GeometricLayer.ts'
import { createShadowLayer } from '@libgl/layers/ShadowLayer.ts'
import type { LogoLayer } from '@libgl/layers/LogoLayer.ts'

type LayerSystemResult = {
  logoController: unknown
  planes: Three.Mesh[]
  logoLayers: LogoLayer[]
  shapeLayer: Three.Mesh
  shadowLayer: Three.Mesh
  planeGeometry: Three.PlaneGeometry
}

/**
 * Sets up the complete layer system including logo, geometric, and shadow layers
 */
export const setupLayerSystem = (
  THREE: typeof Three,
  scene: Three.Scene,
  outlineTexture: Three.Texture,
  stencilTexture: Three.Texture,
): LayerSystemResult => {
  // Create plane geometry for our logo layers
  const planeGeometry = createLogoPlaneGeometry(THREE)

  // Initialize the logo layer manager
  const logoController = createLogoLayer(THREE)

  // Get all layers
  const logoLayers = logoController.getAllLayers()

  // Create meshes for each layer
  const planes = logoController.createPlanes(
    logoLayers,
    planeGeometry,
    outlineTexture,
    stencilTexture,
    scene,
  )

  // Add the shape layer around the logo (part of the 3D scene)
  const shapeLayer = createGeometricLayer(THREE, 2, 2, 0)
  scene.add(shapeLayer)

  // Add the shadow layer behind the logo
  const shadowLayer = createShadowLayer(THREE)
  if (shadowLayer) scene.add(shadowLayer.mesh)

  return {
    logoController,
    planes,
    logoLayers,
    shapeLayer,
    shadowLayer,
    planeGeometry,
  }
}
