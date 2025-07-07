import * as Three from 'three'
import { debugPanelsAPI } from '@islands/DebugPanels.tsx'
import configScene from '@libgl/configScene.json' with { type: 'json' }
import type { ConfigScene, SelectiveColorizationParams } from '@libgl/configScene.types.ts'
import type { LogoController } from '@libgl/layers/LogoLayer.ts'
import type { RendererState } from '@libgl/types.ts'
import { lc, log } from '@lib/logger/index.ts'
import { currentGLTheme } from '@lib/theme/index.ts'
import { rgbToHex } from '@lib/theme/colorUtils/rgbToHex.ts'
import { hexToCSS } from '@lib/theme/colorUtils/hexToCSS.ts'

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
    onSelectiveColorizationChange: (params) => {
      // Update video background selective colorization uniforms
      if (state.videoBackground && state.videoBackground.mesh) {
        const material = state.videoBackground.mesh.material as Three.ShaderMaterial
        if (material && material.uniforms) {
          material.uniforms.selectiveColorizationEnabled.value = params.enabled ? 1.0 : 0.0
          material.uniforms.selectiveBrightnessWeight.value = params.targeting.brightnessWeight
          material.uniforms.selectiveSaturationWeight.value = params.targeting.saturationWeight
          material.uniforms.selectiveBrightnessThreshold.value = params.targeting.brightnessThreshold
          material.uniforms.selectiveSaturationThreshold.value = params.targeting.saturationThreshold
          material.uniforms.selectiveBlendSmoothness.value = params.targeting.blendSmoothness
          material.uniforms.selectiveBlendBalance.value = params.colorBlending.blendBalance

          // Update blend mode
          const blendModeMap: { [key: string]: number } = { brightness: 0, saturation: 1, mixed: 2 }
          material.uniforms.selectiveBlendMode.value = blendModeMap[params.colorBlending.blendMode] ?? 2

          // Update colors if not using theme colors
          if (!params.useThemeColors) {
            if (params.primaryTargetColor) {
              const primaryColor = new THREE.Color(params.primaryTargetColor)
              material.uniforms.selectivePrimaryColor.value = primaryColor.toArray()
            }
            if (params.secondaryTargetColor) {
              const secondaryColor = new THREE.Color(params.secondaryTargetColor)
              material.uniforms.selectiveSecondaryColor.value = secondaryColor.toArray()
            }
          }
        }
      }

      // Update final pass glitch effect uniforms
      if (state.finalPass && state.finalPass.uniforms) {
        // Use segmentedGlitchMode to enable/disable the effect
        state.finalPass.uniforms.segmentedGlitchMode.value = params.enabled ? 1.0 : 0.0
        state.finalPass.uniforms.colorPopIntensity.value = params.colorBlending.blendBalance

        log.debug(lc.GL_DEBUG, 'Selective colorization updated:', {
          enabled: params.enabled,
          blendBalance: params.colorBlending.blendBalance,
          uniformsAfterUpdate: {
            segmentedGlitchMode: state.finalPass.uniforms.segmentedGlitchMode.value,
            colorPopIntensity: state.finalPass.uniforms.colorPopIntensity.value,
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

  // Initialize selective colorization parameters
  if (state.finalPass && state.finalPass.uniforms) {
    const glTheme = currentGLTheme.value

    log.debug(lc.GL_DEBUG, 'Theme colors for selective colorization:', {
      primary: glTheme.primary,
      secondary: glTheme.secondary,
      primaryHex: rgbToHex(glTheme.primary),
      secondaryHex: rgbToHex(glTheme.secondary),
      primaryCSS: hexToCSS(rgbToHex(glTheme.primary)),
      secondaryCSS: hexToCSS(rgbToHex(glTheme.secondary)),
    })

    // Update the debug panels with initial selective colorization values
    debugPanelsAPI.updateSelectiveColorizationParams(
      {
        enabled: state.finalPass.uniforms.segmentedGlitchMode?.value === 1.0,
        useThemeColors: true,
        primaryTargetColor: hexToCSS(rgbToHex(glTheme.primary)),
        secondaryTargetColor: hexToCSS(rgbToHex(glTheme.secondary)),
        targeting: {
          brightnessWeight: 0.5,
          saturationWeight: 0.5,
          brightnessThreshold: 0.5,
          saturationThreshold: 0.5,
          blendSmoothness: 0.1,
        },
        colorBlending: {
          blendMode: 'mixed',
          blendBalance: state.finalPass.uniforms.colorPopIntensity?.value || 1.0,
        },
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
