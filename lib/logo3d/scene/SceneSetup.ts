/**
 * SceneSetup.ts
 *
 * Functions for setting up the THREE.js scene, camera, renderer, and effects
 */

import type { BloomParams } from '../types.ts'
import {
  CAMERA_CONFIG,
  DEFAULT_BLOOM_PARAMS,
  LENS_FLARE_CONFIG,
  PLANE_HEIGHT,
  PLANE_WIDTH,
  POST_PROCESSING_CONFIG,
  RENDERER_CONFIG,
  VIDEO_BACKGROUND_CONFIG,
} from './config.ts'
import {
  ditheringFragmentShader,
  ditheringVertexShader,
  finalPassFragmentShader,
  finalPassVertexShader,
  sharpeningFragmentShader,
  sharpeningVertexShader,
} from '../shaders/index.ts'
import { createVideoBackground } from './VideoBackground.ts'

// Re-export the video background creation function
export { createVideoBackground } from './VideoBackground.ts'

/**
 * Create and initialize the basic 3D scene
 */
export const createScene = async (THREE: any, width: number, height: number) => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000) // Pure black background
  return scene
}

/**
 * Create and initialize the camera
 */
export const createCamera = async (THREE: any, width: number, height: number) => {
  const camera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.fov,
    width / height,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far,
  )
  camera.position.z = CAMERA_CONFIG.position.z
  return camera
}

/**
 * Create and initialize the renderer
 */
export const createRenderer = async (THREE: any, width: number, height: number, container: HTMLDivElement) => {
  const renderer = new THREE.WebGLRenderer({
    antialias: RENDERER_CONFIG.antialias,
    alpha: RENDERER_CONFIG.alpha,
  })

  // Make sure renderer fills the container
  const updateSize = () => {
    // Use the container's dimensions or full viewport
    const w = Math.max(width, container.clientWidth || window.innerWidth)
    const h = Math.max(height, container.clientHeight || window.innerHeight)

    renderer.setSize(w, h)
    // Update pixel ratio for high-DPI displays - use higher value for better quality
    renderer.setPixelRatio(Math.min(
      window.devicePixelRatio * RENDERER_CONFIG.pixelRatioMultiplier,
      RENDERER_CONFIG.pixelRatioMax,
    ))
  }

  // Call once to initialize
  updateSize()

  // Add resize listener to ensure full viewport coverage
  window.addEventListener('resize', updateSize)

  // Clear container and append canvas
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }

  // Make sure canvas container fills the space
  container.style.width = '100%'
  container.style.height = '100%'
  container.style.overflow = 'hidden'
  container.style.position = 'relative'

  // Apply fullscreen styling to the canvas
  const canvas = renderer.domElement
  canvas.style.display = 'block'
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'

  container.appendChild(canvas)

  return renderer
}

/**
 * Create video background for the scene
 */
export const addVideoBackground = async (THREE: any, scene: any) => {
  if (!VIDEO_BACKGROUND_CONFIG.enabled) return undefined

  return createVideoBackground(THREE, scene)
}

/**
 * Create post-processing effects
 */
export const createPostProcessing = async (
  THREE: any,
  scene: any,
  camera: any,
  renderer: any,
  width: number,
  height: number,
  bloomParams: BloomParams = DEFAULT_BLOOM_PARAMS,
) => {
  // Import post-processing effects
  const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js')
  const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js')
  const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')
  const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js')
  const { FilmPass } = await import('three/examples/jsm/postprocessing/FilmPass.js')

  // Set up post-processing effects
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  // Add film grain and scanlines for more depth perception
  const { film } = POST_PROCESSING_CONFIG
  const filmPass = new FilmPass(
    film.noiseIntensity,
    film.scanlineIntensity,
    film.scanlineCount,
    film.grayscale,
  )
  composer.addPass(filmPass)

  // Add bloom effect for glow - with increased strength
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    bloomParams.bloomStrength * 3, // Increase bloom strength multiplier from 2.5 to 3
    bloomParams.bloomRadius,
    bloomParams.bloomThreshold * 0.3, // Lower threshold further from 0.5 to 0.3 to affect more areas
  )
  composer.addPass(bloomPass) // Add bloom AFTER film for more visibility

  // Make bloom visible even on dark colors
  bloomPass.threshold = 0

  // Custom shader for final composition with subtle chromatic aberration
  const finalPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      chromaStrength: { value: POST_PROCESSING_CONFIG.finalPass.chromaStrength },
    },
    vertexShader: finalPassVertexShader,
    fragmentShader: finalPassFragmentShader,
  })
  composer.addPass(finalPass)

  // Add sharpening pass to enhance details
  const sharpeningPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      sharpStrength: { value: POST_PROCESSING_CONFIG.sharpening.strength },
      resolution: { value: new THREE.Vector2(width, height) },
    },
    vertexShader: sharpeningVertexShader,
    fragmentShader: sharpeningFragmentShader,
  })

  // Only add the sharpening pass if it's enabled in config
  if (POST_PROCESSING_CONFIG.sharpening.enabled) {
    composer.addPass(sharpeningPass)
  }

  // Apply dithering as the absolute final pass to eliminate banding from the bloom
  const ditheringPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      time: { value: 0 },
      ditherStrength: { value: POST_PROCESSING_CONFIG.finalPass.ditherStrength },
      ditherFrequency: { value: POST_PROCESSING_CONFIG.finalPass.ditherFrequency },
      ditherAnimation: { value: POST_PROCESSING_CONFIG.finalPass.ditherAnimation },
    },
    vertexShader: ditheringVertexShader,
    fragmentShader: ditheringFragmentShader,
  })
  ditheringPass.renderToScreen = true
  composer.addPass(ditheringPass)

  return { composer, bloomPass, finalPass, ditheringPass, sharpeningPass }
}

/**
 * Add lens flares to the scene
 */
export const addLensFlares = async (THREE: any, scene: any) => {
  const { LensflareElement, Lensflare } = await import('three/examples/jsm/objects/Lensflare.js')

  // Main point light for lens flare
  const flareLight = new THREE.PointLight(
    0xffffff,
    LENS_FLARE_CONFIG.lightIntensity,
    LENS_FLARE_CONFIG.lightDistance,
  )
  flareLight.position.set(...LENS_FLARE_CONFIG.lightPosition)
  scene.add(flareLight)

  // Create lens flare system
  const lensflare = new Lensflare()

  // Create circular texture for the lens flare
  const createFlareTexture = (size: number, color: any, intensity = 1.0) => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')

    if (!context) return new THREE.Texture()

    // Create radial gradient
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    )

    const r = Math.floor(color.r * 255)
    const g = Math.floor(color.g * 255)
    const b = Math.floor(color.b * 255)

    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity})`)
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${intensity * 0.5})`)
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    return texture
  }

  // Add flare elements using built-in texture loader
  const { mainFlare, secondaryFlare, tertiaryFlare } = LENS_FLARE_CONFIG
  const mainFlareColor = new THREE.Color(mainFlare.colorHex)
  const mainFlareTexture = createFlareTexture(mainFlare.size, mainFlareColor, mainFlare.intensity)
  lensflare.addElement(new LensflareElement(mainFlareTexture, mainFlare.size, 0))

  // Add secondary flare
  const secondaryFlareColor = new THREE.Color(secondaryFlare.colorHex)
  const secondaryFlareTexture = createFlareTexture(secondaryFlare.size, secondaryFlareColor, secondaryFlare.intensity)
  lensflare.addElement(new LensflareElement(secondaryFlareTexture, secondaryFlare.size, secondaryFlare.position))

  // Add tertiary flare
  const tertiaryFlareColor = new THREE.Color(tertiaryFlare.colorHex)
  const tertiaryFlareTexture = createFlareTexture(tertiaryFlare.size, tertiaryFlareColor, tertiaryFlare.intensity)
  lensflare.addElement(new LensflareElement(tertiaryFlareTexture, tertiaryFlare.size, tertiaryFlare.position))

  flareLight.add(lensflare)

  return flareLight
}

/**
 * Create plane geometry for the logo
 */
export const createPlaneGeometry = (THREE: any) => {
  return new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT)
}

/**
 * Add UI instructions to the container
 */
export const addInstructions = (container: HTMLDivElement) => {
  const instructions = document.createElement('div')
  instructions.style.position = 'absolute'
  instructions.style.bottom = '10px'
  instructions.style.left = '10px'
  instructions.style.color = 'white'
  instructions.style.fontSize = '12px'
  instructions.style.fontFamily = 'Arial, sans-serif'
  instructions.style.pointerEvents = 'none'
  instructions.style.userSelect = 'none'
  instructions.style.opacity = '0.7'
  instructions.innerHTML =
    'Move mouse to rotate | Click and drag to orbit | Scroll to zoom | Press R to toggle auto-rotation | Press G to regenerate layers'
  container.appendChild(instructions)
}
