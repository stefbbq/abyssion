import { createElectricShaderMaterial } from '../../shaders/ElectricShader.ts'
import { LogoLayer } from '../LogoLayer.ts'

/**
 * Create meshes for each layer
 */
export const createPlanesFromLayers = (
  THREE: any,
  layers: LogoLayer[],
  planeGeometry: any,
  outlineTexture: any,
  stencilTexture: any,
  scene: any,
) => {
  // Sort layers by z-position only (back to front)
  const sortedLayers = [...layers].sort((a, b) => a.zPos - b.zPos)

  return sortedLayers.map((layer) => {
    // Convert plain object color to THREE.Color
    const threeColor = new THREE.Color(layer.color.r, layer.color.g, layer.color.b)

    // Create shader material
    const material = createElectricShaderMaterial(
      THREE,
      {
        texture: layer.isStencil ? stencilTexture : outlineTexture,
        color: threeColor,
        opacity: layer.opacity,
        noiseScale: layer.noiseScale,
        noiseOffset: layer.noiseOffset,
        isStencil: layer.isStencil,
      },
    )

    let mesh

    if (layer.isStencil) {
      // For stencil layers, we'll just use a regular plane now
      // A proper 3D model will be implemented separately later
      mesh = new THREE.Mesh(planeGeometry, material)
    } else {
      // Use normal plane for non-stencil layers
      mesh = new THREE.Mesh(planeGeometry, material)
    }

    mesh.position.z = layer.zPos
    scene.add(mesh)
    return mesh
  })
}
