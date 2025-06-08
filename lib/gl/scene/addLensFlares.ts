import * as Three from 'three'
import sceneConfig from '@lib/sceneConfig.json' with { type: 'json' }

/**
 * Creates a procedural texture for lens flare elements
 *
 * @param THREE - Three.js library instance
 * @param size - Texture size (power of 2)
 * @param type - Type of flare texture ('main', 'ring', 'streak', 'glow')
 * @param color - Color for the flare element
 * @returns Canvas-based texture
 */
const createFlareTexture = (
  THREE: typeof Three,
  size: number,
  type: 'main' | 'ring' | 'streak' | 'glow',
  color: number,
): import('three').CanvasTexture => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')!
  const center = size / 2
  const threeColor = new THREE.Color(color)
  const gradient = context.createRadialGradient(center, center, 0, center, center, center)

  switch (type) {
    case 'main':
      // Large central flare with soft falloff
      gradient.addColorStop(0, `rgba(${threeColor.r * 255}, ${threeColor.g * 255}, ${threeColor.b * 255}, 1)`)
      gradient.addColorStop(0.1, `rgba(${threeColor.r * 255}, ${threeColor.g * 255}, ${threeColor.b * 255}, 0.8)`)
      gradient.addColorStop(0.3, `rgba(${threeColor.r * 255}, ${threeColor.g * 255}, ${threeColor.b * 255}, 0.4)`)
      gradient.addColorStop(0.6, `rgba(${threeColor.r * 255}, ${threeColor.g * 255}, ${threeColor.b * 255}, 0.1)`)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      break

    case 'ring':
      // Ring-shaped flare
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0)')
      gradient.addColorStop(0.5, `rgba(${threeColor.r * 255}, ${threeColor.g * 255}, ${threeColor.b * 255}, 0.8)`)
      gradient.addColorStop(0.7, `rgba(${threeColor.r * 255}, ${threeColor.g * 255}, ${threeColor.b * 255}, 0.3)`)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      break

    case 'streak': {
      // Mass Effect style streak
      context.fillStyle = 'rgba(0, 0, 0, 0)'
      context.fillRect(0, 0, size, size)

      const streakGradient = context.createLinearGradient(0, center - 2, 0, center + 2)
      streakGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
      streakGradient.addColorStop(0.5, `rgba(${threeColor.r * 255}, ${threeColor.g * 255}, ${threeColor.b * 255}, 0.6)`)
      streakGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      context.fillStyle = streakGradient
      context.fillRect(0, center - 2, size, 4)

      const horizontalGradient = context.createLinearGradient(0, 0, size, 0)
      horizontalGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
      horizontalGradient.addColorStop(0.5, `rgba(${threeColor.r * 255}, ${threeColor.g * 255}, ${threeColor.b * 255}, 0.8)`)
      horizontalGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      context.globalCompositeOperation = 'multiply'
      context.fillStyle = horizontalGradient
      context.fillRect(0, center - 2, size, 4)

      return new THREE.CanvasTexture(canvas)
    }
    case 'glow':
      // Soft glow
      gradient.addColorStop(0, `rgba(${threeColor.r * 255}, ${threeColor.g * 255}, ${threeColor.b * 255}, 0.6)`)
      gradient.addColorStop(0.5, `rgba(${threeColor.r * 255}, ${threeColor.g * 255}, ${threeColor.b * 255}, 0.2)`)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      break
  }

  // Apply gradient for non-streak types
  if (type === 'main' || type === 'ring' || type === 'glow') {
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

/**
 * Add Mass Effect style lens flares to the scene
 *
 * Creates a wide, multi-element lens flare effect with:
 * - Large central flare
 * - Horizontal light streaks
 * - Secondary ring flares
 * - Subtle glow elements
 * - Theme-based colors
 */
export const addLensFlares = async (
  THREE: typeof Three,
  scene: Three.Scene,
): Promise<Three.PointLight> => {
  const { LensflareElement, Lensflare } = await import('three/examples/jsm/objects/Lensflare.js')
  const { lensFlare } = sceneConfig.postProcessingConfig

  // Create the main light source
  const flareLight = new THREE.PointLight(
    0xffffff,
    lensFlare.lightIntensity,
    lensFlare.lightDistance,
  )
  flareLight.position.set(...lensFlare.lightPosition)
  scene.add(flareLight)

  // Create the lens flare object
  const lensflare = new Lensflare()

  // Create procedural textures for different flare elements
  const mainFlareTexture = createFlareTexture(THREE, 512, 'main', lensFlare.mainFlare.colorHex)
  const ringTexture = createFlareTexture(THREE, 256, 'ring', lensFlare.secondaryFlare.colorHex)
  const streakTexture = createFlareTexture(THREE, 1024, 'streak', lensFlare.mainFlare.colorHex)
  const glowTexture = createFlareTexture(THREE, 256, 'glow', lensFlare.tertiaryFlare.colorHex)

  // Main central flare - large and prominent
  lensflare.addElement(
    new LensflareElement(
      mainFlareTexture,
      lensFlare.mainFlare.size,
      0.0, // At light source position
      new THREE.Color(lensFlare.mainFlare.colorHex),
      THREE.AdditiveBlending,
    ),
  )

  // Wide horizontal streak - Mass Effect signature look
  lensflare.addElement(
    new LensflareElement(
      streakTexture,
      800, // Very wide for dramatic effect
      0.0, // At light source position
      new THREE.Color(lensFlare.mainFlare.colorHex),
      THREE.AdditiveBlending,
    ),
  )

  // Secondary ring flare
  lensflare.addElement(
    new LensflareElement(
      ringTexture,
      lensFlare.secondaryFlare.size,
      lensFlare.secondaryFlare.position,
      new THREE.Color(lensFlare.secondaryFlare.colorHex),
      THREE.AdditiveBlending,
    ),
  )

  // Tertiary glow element
  lensflare.addElement(
    new LensflareElement(
      glowTexture,
      lensFlare.tertiaryFlare.size,
      lensFlare.tertiaryFlare.position,
      new THREE.Color(lensFlare.tertiaryFlare.colorHex),
      THREE.AdditiveBlending,
    ),
  )

  // Additional smaller flare elements for complexity
  lensflare.addElement(
    new LensflareElement(
      glowTexture,
      30,
      0.8,
      new THREE.Color(lensFlare.tertiaryFlare.colorHex).multiplyScalar(0.7),
      THREE.AdditiveBlending,
    ),
  )

  lensflare.addElement(
    new LensflareElement(
      ringTexture,
      40,
      1.2,
      new THREE.Color(lensFlare.secondaryFlare.colorHex).multiplyScalar(0.5),
      THREE.AdditiveBlending,
    ),
  )

  // Distant glow elements
  lensflare.addElement(
    new LensflareElement(
      glowTexture,
      25,
      1.5,
      new THREE.Color(lensFlare.mainFlare.colorHex).multiplyScalar(0.3),
      THREE.AdditiveBlending,
    ),
  )

  // Add the lens flare to the light
  flareLight.add(lensflare)

  return flareLight
}
