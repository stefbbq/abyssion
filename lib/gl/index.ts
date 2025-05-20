import type { InitOptions, RendererState } from './types.ts'
import { DEFAULT_BLOOM_PARAMS, PLANE_HEIGHT, PLANE_WIDTH, RENDERER_CONFIG } from './scene/config.ts'
import { createScene } from './scene/createScene.ts'
import { createCamera } from './scene/createCamera.ts'
import { createRenderer } from './scene/createRenderer.ts'
import { createPostProcessing } from './scene/createPostProcessing.ts'
import { addLensFlares } from './scene/addLensFlares.ts'
import { createPlaneGeometry } from './scene/createPlaneGeometry.ts'
import { addVideoBackground } from './scene/addVideoBackground.ts'
import { DebugOverlay } from './debug/DebugOverlay.ts' // Debug overlay for UI and DOF
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

  // Set up the core rendering elements
  const scene = await createScene(THREE, width, height)
  const camera = await createCamera(THREE, width, height)
  const renderer = await createRenderer(THREE, width, height, container)

  // Debug Overlay
  let debugOverlay: DebugOverlay | undefined
  let controls: any = undefined

  // Add video background if enabled
  const videoBackground = await addVideoBackground(THREE, scene)

  // Set up post-processing effects
  const { composer, bokehPass, bloomPass, finalPass, ditheringPass, sharpeningPass } = await createPostProcessing(
    THREE,
    scene,
    camera,
    renderer,
    width,
    height,
    DEFAULT_BLOOM_PARAMS,
  )

  // Create the 2D UI overlay (scene, camera, resize)
  const uiLayer = createUILayer(THREE, width, height)

  // Add window resize handler to update camera aspect ratio
  const handleResize = () => {
    // Update camera aspect ratio
    camera.aspect = globalThis.innerWidth / globalThis.innerHeight
    camera.updateProjectionMatrix()

    // Update overlay camera and dimensions
    uiLayer.resize(globalThis.innerWidth, globalThis.innerHeight)

    // Composer needs to be resized as well
    composer.setSize(globalThis.innerWidth, globalThis.innerHeight)
    // Set the same high pixel ratio for the composer
    composer.setPixelRatio(Math.min(
      globalThis.devicePixelRatio * RENDERER_CONFIG.pixelRatioMultiplier,
      RENDERER_CONFIG.pixelRatioMax,
    ))
  }

  // Register resize listener
  globalThis.addEventListener('resize', handleResize)

  // Add lens flares and other scene elements
  await addLensFlares(THREE, scene)

  // Set up orbit controls
  controls = await setupOrbitControls(THREE, camera, renderer.domElement)

  // Set up post-processing and get BokehPass reference

  // Setup DebugOverlay after canvas is in DOM
  debugOverlay = new DebugOverlay(container, {
    initialDebug: false,
    onToggleDebug: () => {
      // Always keep controls enabled, even in debug mode
      if (controls) controls.enabled = true
    },
    onChangeDOF: ({ focus, aperture, maxblur }) => {
      if (bokehPass && bokehPass.materialBokeh && bokehPass.materialBokeh.uniforms) {
        bokehPass.materialBokeh.uniforms.focus.value = focus
        bokehPass.materialBokeh.uniforms.aperture.value = aperture
        bokehPass.materialBokeh.uniforms.maxblur.value = maxblur
      }
    },
  }) // Attach bokehPass to debugOverlay so controls always update the live pass
  ;(debugOverlay as any).bokehPass = bokehPass
  // Initialize DOF controls UI using the bokehPass reference
  if (bokehPass && bokehPass.materialBokeh && bokehPass.materialBokeh.uniforms) {
    // --- Add pink focus plane for DOF visualization ---
    const focusPlaneMaterial = new THREE.MeshBasicMaterial({
      color: 0xff69b4,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    })
    const focusPlane = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT), focusPlaneMaterial)
    focusPlane.visible = false
    scene.add(focusPlane)

    // Helper to update plane position and show/hide
    function showFocusPlane(focusDistance: number) {
      // Place plane at 'focusDistance' in front of the camera
      camera.updateMatrixWorld()
      const camDir = new THREE.Vector3()
      camera.getWorldDirection(camDir)
      const camPos = camera.getWorldPosition(new THREE.Vector3())
      focusPlane.position.copy(camPos).add(camDir.multiplyScalar(focusDistance))
      focusPlane.quaternion.copy(camera.quaternion)
      focusPlane.visible = true
    }

    // Keep the focus plane facing the camera while visible
    function alignFocusPlane() {
      if (focusPlane.visible) {
        focusPlane.quaternion.copy(camera.quaternion)
      }
    }
    if (typeof window !== 'undefined') {
      ;(window as any).alignFocusPlane = alignFocusPlane
    }

    function hideFocusPlane() {
      focusPlane.visible = false
    }

    debugOverlay.updateDOFControls({
      focus: bokehPass.materialBokeh.uniforms.focus.value,
      aperture: bokehPass.materialBokeh.uniforms.aperture.value,
      maxblur: bokehPass.materialBokeh.uniforms.maxblur.value,
    }, (
      { focus, aperture, maxblur }: { focus: number; aperture: number; maxblur: number },
      meta?: { eventType?: string },
    ) => {
      if (
        (debugOverlay as any).bokehPass && (debugOverlay as any).bokehPass.materialBokeh &&
        (debugOverlay as any).bokehPass.materialBokeh.uniforms
      ) {
        ;(debugOverlay as any).bokehPass.materialBokeh.uniforms.focus.value = focus
        ;(debugOverlay as any).bokehPass.materialBokeh.uniforms.aperture.value = aperture
        ;(debugOverlay as any).bokehPass.materialBokeh.uniforms.maxblur.value = maxblur
      }
      if (meta && meta.eventType) {
        if (meta.eventType === 'input') showFocusPlane(focus)
        if (meta.eventType === 'change') hideFocusPlane()
      }
    })
  }

  // Show camera and plane Zs in debug panel
  function updateDebugInfo() {
    let planesZ = state.planes
      ? state.planes.map((p: any, i: number) => `Plane ${i}: z=${p.position.z.toFixed(3)}`).join('<br>')
      : ''
    debugOverlay?.setDebugInfo(
      `<b>Camera Z:</b> ${camera.position.z.toFixed(3)}<br>${planesZ}`,
    )
  }

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
    // Update debug info each frame
    updateDebugInfo()
    // First render the 3D scene with post-processing
    origRender.apply(this, arguments)

    // Defensive check and debug logging for overlay rendering
    if (!uiLayer || !uiLayer.scene || !uiLayer.camera) {
      console.warn('uiLayer, scene, or camera is undefined:', {
        uiLayer,
        scene: uiLayer?.scene,
        camera: uiLayer?.camera,
      })
      return
    }
    renderer.autoClear = false // Don't clear what we've rendered
    try {
      renderer.render(uiLayer.scene, uiLayer.camera)
    } catch (e) {
      console.error('Error rendering UI overlay:', e, { uiLayer, scene: uiLayer.scene, camera: uiLayer.camera })
    }
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
