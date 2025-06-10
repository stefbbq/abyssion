import * as Three from 'three'
import { createLogoPlaneGeometry } from '@libgl/scene/createLogoPlaneGeometry.ts'
import { createLogoLayer } from '@libgl/layers/index.ts'
import { createGeometricLayer } from '@libgl/layers/GeometricLayer.ts'
import { createShadowLayer } from '@libgl/layers/ShadowLayer.ts'
import type { LogoController, LogoLayer } from '@libgl/layers/LogoLayer.ts'

type LayerSystem = {
  logoController: LogoController
  logoPlanes: Three.Mesh[]
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
): LayerSystem => {
  // Logo Layers
  const planeGeometry = createLogoPlaneGeometry(THREE)
  const logoController = createLogoLayer(THREE)
  const logoLayers = logoController.getAllLayers()
  const logoPlanes = logoController.createPlanes(
    logoLayers,
    planeGeometry,
    outlineTexture,
    stencilTexture,
    scene,
  )

  // Geometric Layer
  const shapeLayer = createGeometricLayer(THREE, 2, 2, 0)
  scene.add(shapeLayer)

  // Shadow Layer
  const shadowLayer = createShadowLayer(THREE)
  if (shadowLayer) scene.add(shadowLayer.mesh)

  return {
    logoController,
    logoPlanes,
    logoLayers,
    shapeLayer,
    shadowLayer,
    planeGeometry,
  }
}
