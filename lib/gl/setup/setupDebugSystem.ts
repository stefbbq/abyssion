import { lc, log } from '../../logger/index.ts'
import { DebugOverlay } from '../debug/DebugOverlay.ts'
import sceneConfig from '@lib/sceneConfig.json' with { type: 'json' }

type DebugSystemConfig = {
  container: HTMLDivElement
  camera: any
  scene: any
  bokehPass: any
  logoLayer: any
  state: any
  THREE: typeof import('three')
}

type DebugSystemResult = {
  debugOverlay: DebugOverlay
  updateDebugInfo: () => void
  handleRegenerateRandomLayers: () => void
}

/**
 * Sets up the debug overlay system with DOF controls and regeneration
 */
export const setupDebugSystem = async (config: DebugSystemConfig): Promise<DebugSystemResult> => {
  const { container, camera, scene, bokehPass, logoLayer, state, THREE } = config
  const { planeWidth, planeHeight } = sceneConfig

  // Setup DebugOverlay
  const debugOverlay = new DebugOverlay(container, {
    initialDebug: false,
    onToggleDebug: () => {
      if (state.controls) state.controls.enabled = true
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
    const focusPlaneMaterial = new THREE.MeshBasicMaterial({
      color: 0xff69b4,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    })
    const focusPlane = new THREE.Mesh(new THREE.PlaneGeometry(planeWidth, planeHeight), focusPlaneMaterial)
    focusPlane.visible = false
    scene.add(focusPlane)

    const showFocusPlane = (focusDistance: number) => {
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
    const alignFocusPlane = () => focusPlane.visible && focusPlane.quaternion.copy(camera.quaternion)

    if (typeof globalThis !== 'undefined') {
      ;(globalThis as any).alignFocusPlane = alignFocusPlane
    }

    const hideFocusPlane = () => focusPlane.visible = false

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

  // Debug info updater function
  const updateDebugInfo = () => {
    const planesZ = state.planes ? state.planes.map((p: any, i: number) => `Plane ${i}: z=${p.position.z.toFixed(3)}`).join('<br>') : ''
    debugOverlay?.setDebugInfo(
      `<b>Camera Z:</b> ${camera.position.z.toFixed(3)}<br>${planesZ}`,
    )
  }

  // Layer regeneration function
  const handleRegenerateRandomLayers = () => {
    // Note: In the new system, regeneration happens automatically in the logo page orchestrator
    // This function is kept for keyboard control compatibility
    const { planes: newPlanes, layers: newLayers } = logoLayer.regenerate(
      scene,
      state.planes,
      state.layers,
      state.planeGeometry,
      state.outlineTexture,
      state.stencilTexture,
    )

    state.planes = newPlanes
    state.layers = newLayers
  }

  return {
    debugOverlay,
    updateDebugInfo,
    handleRegenerateRandomLayers,
  }
}
