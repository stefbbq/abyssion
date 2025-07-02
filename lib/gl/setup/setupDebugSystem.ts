import * as Three from 'three'
import { debugPanelsAPI } from '@islands/DebugPanels.tsx'
import configScene from '@libgl/configScene.json' with { type: 'json' }
import type { ConfigScene } from '@libgl/configScene.types.ts'
import type { LogoController } from '@libgl/layers/LogoLayer.ts'
import type { RendererState } from '@libgl/types.ts'
import { lc, log } from '@lib/logger/index.ts'
import { getGLTheme } from '@lib/theme/index.ts'
import { rgbToHex } from '@libtheme/utils/rgbToHex.ts'
import { hexToCSS } from '@libtheme/utils/hexToCSS.ts'

type DebugSystemConfig = {
  canvas: HTMLCanvasElement
  camera: Three.Camera
  scene: Three.Scene
  bokehPass: Three.Pass
  logoController: LogoController
  state: RendererState
  THREE: typeof Three
}

type DebugSystemResult = {
  updateDebugInfo: () => void
  handleRegenerateRandomLayers: () => void
}

/**
 * Sets up the debug system with DOF controls and regeneration
 * Now uses Preact components instead of DOM manipulation
 */
export const setupDebugSystem = (config: DebugSystemConfig): DebugSystemResult => {
  log.debug(lc.GL_DEBUG, 'setupDebugSystem called with config:', config)

  const { camera, scene, bokehPass, logoController, state, THREE } = config
  const { planeWidth, planeHeight } = configScene as ConfigScene

  // Initialize focus plane for DOF visualization
  let focusPlane: Three.Mesh | null = null

  // Set up callbacks for the debug panels
  debugPanelsAPI.setCallbacks({
    onToggleDebug: () => {
      if (state.controls) state.controls.enabled = true
    },
    onDOFChange: ({ focus, aperture, maxblur }, meta) => {
      if (bokehPass && bokehPass.materialBokeh && bokehPass.materialBokeh.uniforms) {
        bokehPass.materialBokeh.uniforms.focus.value = focus
        bokehPass.materialBokeh.uniforms.aperture.value = aperture
        bokehPass.materialBokeh.uniforms.maxblur.value = maxblur

        // Handle focus plane visualization
        if (meta && meta.eventType) {
          if (meta.eventType === 'input' && focusPlane) {
            // Show focus plane during adjustment
            camera.updateMatrixWorld()
            const camDir = new Three.Vector3()
            camera.getWorldDirection(camDir)
            const camPos = camera.getWorldPosition(new Three.Vector3())
            focusPlane.position.copy(camPos).add(camDir.multiplyScalar(focus))
            focusPlane.quaternion.copy(camera.quaternion)
            focusPlane.visible = true
          } else if (meta.eventType === 'change' && focusPlane) {
            // Hide focus plane when adjustment complete
            focusPlane.visible = false
          }
        }
      }
    },
    onToneMapChange: ({ enabled, blendAmount }) => {
      if (state.finalPass && state.finalPass.uniforms) {
        state.finalPass.uniforms.toneMapEnabled.value = enabled ? 1.0 : 0.0
        state.finalPass.uniforms.toneMapBlendAmount.value = blendAmount
        log.debug(lc.GL_DEBUG, 'Tone mapping updated:', {
          enabled,
          blendAmount,
          uniformsAfterUpdate: {
            toneMapEnabled: state.finalPass.uniforms.toneMapEnabled.value,
            toneMapBlendAmount: state.finalPass.uniforms.toneMapBlendAmount.value,
          },
        })
      }
    },
  })

  // Initialize DOF parameters
  if (bokehPass && bokehPass.materialBokeh && bokehPass.materialBokeh.uniforms) {
    // Create focus plane for visualization
    const focusPlaneMaterial = new THREE.MeshBasicMaterial({
      color: 0xff69b4,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    })
    focusPlane = new THREE.Mesh(new THREE.PlaneGeometry(planeWidth, planeHeight), focusPlaneMaterial)
    focusPlane.name = 'DebugFocusPlane'
    focusPlane.visible = false
    scene.add(focusPlane)

    // Keep the focus plane facing the camera while visible
    const alignFocusPlane = () => {
      if (focusPlane && focusPlane.visible) {
        focusPlane.quaternion.copy(camera.quaternion)
      }
    }

    if (typeof globalThis !== 'undefined') {
      // deno-lint-ignore no-explicit-any
      ;(globalThis as any).alignFocusPlane = alignFocusPlane
    }

    // Update the debug panels with initial DOF values
    debugPanelsAPI.updateDOFParams({
      focus: bokehPass.materialBokeh.uniforms.focus.value,
      aperture: bokehPass.materialBokeh.uniforms.aperture.value,
      maxblur: bokehPass.materialBokeh.uniforms.maxblur.value,
    })
  }

  // Initialize tone mapping parameters
  if (state.finalPass && state.finalPass.uniforms) {
    const glTheme = getGLTheme()

    log.debug(lc.GL_DEBUG, 'Theme colors for tone mapping:', {
      primary: glTheme.primary,
      secondary: glTheme.secondary,
      primaryHex: rgbToHex(glTheme.primary),
      secondaryHex: rgbToHex(glTheme.secondary),
      primaryCSS: hexToCSS(rgbToHex(glTheme.primary)),
      secondaryCSS: hexToCSS(rgbToHex(glTheme.secondary)),
    })

    // Update the debug panels with initial tone map values
    debugPanelsAPI.updateToneMapParams(
      {
        enabled: state.finalPass.uniforms.toneMapEnabled?.value === 1.0,
        blendAmount: state.finalPass.uniforms.toneMapBlendAmount?.value || 1.0,
      },
      {
        highlight: hexToCSS(rgbToHex(glTheme.primary)),
        shadow: hexToCSS(rgbToHex(glTheme.secondary)),
      },
    )
  }

  // Debug info updater function
  const updateDebugInfo = () => {
    // Camera information
    const cameraFOV = (camera as Three.PerspectiveCamera).fov || 'N/A'
    const cameraInfo = [
      `<b>Camera Position:</b> x=${camera.position.x.toFixed(3)} y=${camera.position.y.toFixed(3)} z=${camera.position.z.toFixed(3)}`,
      `<b>Camera Rotation:</b> x=${camera.rotation.x.toFixed(3)} y=${camera.rotation.y.toFixed(3)} z=${camera.rotation.z.toFixed(3)}`,
      `<b>Camera FOV:</b> ${cameraFOV}°`,
    ].join('<br>')

    // Scene elements information
    const sceneElements = scene.children
      .map((child: Three.Object3D, index: number) => {
        const type = child.type
        const name = child.name || `unnamed_${type}_${index}`
        const position = `(${child.position.x.toFixed(2)}, ${child.position.y.toFixed(2)}, ${child.position.z.toFixed(2)})`
        const visible = child.visible ? '✓' : '✗'
        return `${visible} ${name}: ${type} ${position}`
      })
      .join('<br>')

    const debugContent = [
      cameraInfo,
      '<br/><b>Scene Elements:</b>',
      sceneElements || 'No scene elements',
    ].join('<br>')

    debugPanelsAPI.setDebugInfo(debugContent)
  }

  // Layer regeneration function
  const handleRegenerateRandomLayers = () => {
    if (!scene || !state.logoPlanes || !state.logoLayers || !state.planeGeometry || !state.outlineTexture || !state.stencilTexture) {
      log(lc.GL, 'Cannot regenerate layers: missing state')
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
    updateDebugInfo,
    handleRegenerateRandomLayers,
  }
}
