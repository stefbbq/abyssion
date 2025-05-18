import type { InitOptions, RendererState } from './types.ts'
import { DEFAULT_BLOOM_PARAMS, PLANE_HEIGHT, PLANE_WIDTH, RENDERER_CONFIG } from './scene/config.ts'
import { initializeNoise } from './noise/PerlinNoise.ts'
import {
  addInstructions,
  addLensFlares,
  addVideoBackground,
  createCamera,
  createPlaneGeometry,
  createPostProcessing,
  createRenderer,
  createScene,
} from './scene/SceneSetup.ts'
import { setupKeyboardControls, setupOrbitControls } from './controls/OrbitControlsSetup.ts'
import { createLogoLayer } from './layers/index.ts'
import { createGeometricLayer } from './layers/GeometricLayer.ts'
import { createUILayer } from './layers/UILayer.ts'
import { createShadowLayer } from './layers/ShadowLayer.ts'
import { startAnimationLoop } from './animation/AnimationLoop.ts'

/**
 * Initialize the Logo3D renderer
 */
export const initLogo3D = async (options: InitOptions) => {
  const { width, height, outlineTexturePath, stencilTexturePath, container } = options

  // We need to dynamically import three.js since it's a client-side only library
  const THREE = await import('three')

  // Initialize perlin noise for electric effects
  const noise = initializeNoise()

  // Set up the core rendering elements
  const scene = await createScene(THREE, width, height)
  const camera = await createCamera(THREE, width, height)
  const renderer = await createRenderer(THREE, width, height, container)

  // Add video background if enabled
  const videoBackground = await addVideoBackground(THREE, scene)

  // Set up post-processing effects
  const { composer, bloomPass, finalPass, ditheringPass, sharpeningPass } = await createPostProcessing(
    THREE,
    scene,
    camera,
    renderer,
    width,
    height,
    DEFAULT_BLOOM_PARAMS,
  )

  // Create the 2D UI overlay
  const uiLayer = createUILayer(THREE, width, height)

  // Add window resize handler to update camera aspect ratio
  const handleResize = () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    // Update overlay dimensions
    uiLayer.resize(window.innerWidth, window.innerHeight)

    // Composer needs to be resized as well
    composer.setSize(window.innerWidth, window.innerHeight)
    // Set the same high pixel ratio for the composer
    composer.setPixelRatio(Math.min(
      window.devicePixelRatio * RENDERER_CONFIG.pixelRatioMultiplier,
      RENDERER_CONFIG.pixelRatioMax,
    ))
  }

  // Register resize listener
  window.addEventListener('resize', handleResize)

  // Add lens flares and other scene elements
  await addLensFlares(THREE, scene)

  // Add UI instructions
  // addInstructions(container)

  // Set up camera controls
  const controls = await setupOrbitControls(THREE, camera, renderer.domElement)

  // Load textures
  const textureLoader = new THREE.TextureLoader()
  textureLoader.setCrossOrigin('anonymous')

  // Add onload callback to verify stencil texture loading
  const stencilTexture = textureLoader.load(
    stencilTexturePath,
    (texture: any) => {
      // Just log basic success message
      console.log('Stencil texture loaded successfully')
    },
    undefined,
    (error: any) => {
      console.error('Error loading stencil texture:', error)
    },
  )

  // Add onload callback to verify outline texture loading
  const outlineTexture = textureLoader.load(
    outlineTexturePath,
    (texture: any) => {
      // Just log basic success message
      console.log('Outline texture loaded successfully')
    },
    undefined,
    (error: any) => {
      console.error('Error loading outline texture:', error)
    },
  )

  // Ensure textures don't repeat
  stencilTexture.wrapS = THREE.ClampToEdgeWrapping
  stencilTexture.wrapT = THREE.ClampToEdgeWrapping
  outlineTexture.wrapS = THREE.ClampToEdgeWrapping
  outlineTexture.wrapT = THREE.ClampToEdgeWrapping

  // Create plane geometry for our layers
  const planeGeometry = createPlaneGeometry(THREE)

  // Initialize the logo layer manager
  const logoLayer = createLogoLayer(THREE)

  // Get all layers
  const allLayers = logoLayer.getAllLayers()

  // Create meshes for each layer
  const planes = logoLayer.createPlanes(
    allLayers,
    planeGeometry,
    outlineTexture,
    stencilTexture,
    scene,
  )

  // Add the shape layer around the logo (part of the 3D scene)
  const shapeLayer = createGeometricLayer(THREE, 2, 2, 0)
  scene.add(shapeLayer)

  // Add the shadow layer behind the logo
  const shadowLayer = createShadowLayer(THREE, PLANE_WIDTH, PLANE_HEIGHT)
  if (shadowLayer) {
    scene.add(shadowLayer.mesh)
  }

  // Initialize renderer state
  const state: RendererState = {
    scene,
    camera,
    renderer,
    composer,
    controls,
    bloomPass,
    finalPass,
    ditheringPass,
    sharpeningPass,
    planes,
    layers: allLayers,
    time: 0,
    planeGeometry,
    outlineTexture,
    stencilTexture,
    THREE,
    uiOverlay: uiLayer, // 2D HUD overlay
    shapeLayer, // 3D shape layer around the logo
    videoBackground, // Video background
  }

  // Set up layer regeneration function
  const handleRegenerateRandomLayers = () => {
    const { planes: newPlanes, layers: newLayers } = logoLayer.regenerate(
      scene,
      state.planes,
      state.layers,
      planeGeometry,
      outlineTexture,
      stencilTexture,
    )

    // Update state
    state.planes = newPlanes
    state.layers = newLayers
  }

  // Set up keyboard controls
  const keyboardCleanup = setupKeyboardControls(
    controls,
    handleRegenerateRandomLayers,
  )

  // Override the render method to include our overlay
  const origRender = composer.render
  composer.render = function () {
    // First render the 3D scene with post-processing
    origRender.apply(this, arguments)

    // Then render the 2D UI overlay directly
    renderer.autoClear = false // Don't clear what we've rendered
    renderer.render(uiLayer.scene, uiLayer.camera)
    renderer.autoClear = true // Restore default
  }

  // Start animation loop
  const animationCleanup = startAnimationLoop(state)

  // Return cleanup function
  return () => {
    // Stop animation
    animationCleanup()

    // Remove event listeners
    keyboardCleanup()
    window.removeEventListener('resize', handleResize)

    // Clean up video background
    if (videoBackground) {
      videoBackground.dispose()
    }

    // Clean up planes
    logoLayer.dispose(scene, planes)

    // Remove shape layer
    scene.remove(shapeLayer)
    shapeLayer.traverse((object: any) => {
      if ('geometry' in object) object.geometry.dispose()
      if ('material' in object) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material: any) => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })

    // Clean up shadow layer
    if (shadowLayer) {
      shadowLayer.dispose()
    }

    // Clean up UI overlay
    uiLayer.scene.traverse((object: any) => {
      if ('geometry' in object) object.geometry.dispose()
      if ('material' in object) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material: any) => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })

    // Clean up orbit controls
    controls.dispose()

    // Dispose renderer and composer
    renderer.dispose()
    composer.dispose()
  }
}

export { type InitOptions, type RendererState }
