import * as Three from 'three'
import { DebugOverlay } from '@libgl/debug/DebugOverlay.ts'
import configScene from '@libgl/configScene.json' with { type: 'json' }
import type { ConfigScene } from '@libgl/configScene.types.ts'
import type { LogoController } from '@libgl/layers/LogoLayer.ts'
import type { RendererState } from '@libgl/types.ts'

type DebugSystemConfig = {
  container: HTMLDivElement
  camera: Three.Camera
  scene: Three.Scene
  bokehPass: Three.Pass
  logoController: LogoController
  state: RendererState
  THREE: typeof Three
}

type DebugSystemResult = {
  debugOverlay: DebugOverlay
  updateDebugInfo: () => void
  handleRegenerateRandomLayers: () => void
}

/**
 * Sets up the debug overlay system with DOF controls and regeneration
 */
export const setupDebugSystem = (config: DebugSystemConfig): DebugSystemResult => {
  const { container, camera, scene, bokehPass, logoController, state, THREE } = config
  const { planeWidth, planeHeight } = configScene as ConfigScene

  // Setup DebugOverlay
  const debugOverlay = new DebugOverlay(container, {
    forceDebug: false,
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
  debugOverlay.bokehPass = bokehPass

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
      // deno-lint-ignore no-explicit-any
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
        debugOverlay.bokehPass && debugOverlay.bokehPass.materialBokeh && debugOverlay.bokehPass.materialBokeh.uniforms
      ) {
        debugOverlay.bokehPass.materialBokeh.uniforms.focus.value = focus
        debugOverlay.bokehPass.materialBokeh.uniforms.aperture.value = aperture
        debugOverlay.bokehPass.materialBokeh.uniforms.maxblur.value = maxblur
      }
      if (meta && meta.eventType) {
        if (meta.eventType === 'input') showFocusPlane(focus)
        if (meta.eventType === 'change') hideFocusPlane()
      }
    })
  }

  // Debug info updater function
  const updateDebugInfo = () => {
    const planesZ = state.logoPlanes
      ? state.logoPlanes.map((p: Three.Mesh, i: number) => `Plane ${i}: z=${p.position.z.toFixed(3)}`).join('<br>')
      : ''
    debugOverlay?.setDebugInfo(
      `<b>Camera Z:</b> ${camera.position.z.toFixed(3)}<br>${planesZ}`,
    )
  }

  // Layer regeneration function
  const handleRegenerateRandomLayers = () => {
    if (!scene || !state.logoPlanes || !state.logoLayers || !state.planeGeometry || !state.outlineTexture || !state.stencilTexture) {
      console.warn('Cannot regenerate layers: missing state')
      return
    }

    const { planes: newPlanes, layers: newLayers } = logoController.regenerate(
      scene,
      state.logoPlanes,
      state.planeGeometry,
      state.outlineTexture,
      state.stencilTexture,
    )

    state.logoPlanes = newPlanes
    state.logoLayers = newLayers
  }

  return {
    debugOverlay,
    updateDebugInfo,
    handleRegenerateRandomLayers,
  }
}
