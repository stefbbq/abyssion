import { LENS_FLARE_CONFIG } from './config.ts'

/**
 * Add lens flares to the scene
 */
export const addLensFlares = async (
  THREE: typeof import('three'),
  scene: import('three').Scene,
): Promise<import('three').PointLight> => {
  const { LensflareElement, Lensflare } = await import('three/examples/jsm/objects/Lensflare.js')
  const flareLight = new THREE.PointLight(
    0xffffff,
    LENS_FLARE_CONFIG.lightIntensity,
    LENS_FLARE_CONFIG.lightDistance,
  )
  flareLight.position.set(...LENS_FLARE_CONFIG.lightPosition)
  scene.add(flareLight)
  const lensflare = new Lensflare()
  flareLight.add(lensflare)
  return flareLight
}
