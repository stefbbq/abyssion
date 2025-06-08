import * as Three from 'three'
import { createLogoPlaneGeometry } from '../scene/createLogoPlaneGeometry.ts'
import { createLogoLayer } from '../layers/index.ts'
import { createGeometricLayer } from '../layers/GeometricLayer.ts'
import { createShadowLayer } from '../layers/ShadowLayer.ts'
import { LogoLayer } from '../layers/LogoLayer.ts'

type LayerSystemResult = {
  logoLayer: LogoLayer
  planes: any[]
  layers: any[]
  shapeLayer: any
  shadowLayer: any
  planeGeometry: any
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
  const logoLayer = createLogoLayer(THREE)

  // Get all layers
  const layers = logoLayer.getAllLayers()

  // Create meshes for each layer
  const planes = logoLayer.createPlanes(
    layers,
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
    logoLayer,
    planes,
    layers,
    shapeLayer,
    shadowLayer,
    planeGeometry,
  }
}
