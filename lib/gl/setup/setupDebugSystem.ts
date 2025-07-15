import * as Three from 'three'
import { debugPanelsAPI } from '@islands/DebugPanels.tsx'
import configScene from '@libgl/configScene.json' with { type: 'json' }
import type { ConfigScene } from '@libgl/configScene.types.ts'
import type { LogoController } from '@libgl/layers/LogoLayer.ts'
import type { RendererState, VideoDebugInfo } from '@libgl/types.ts'
import { lc, log } from '@lib/logger/index.ts'
import { currentGLTheme } from '@lib/theme/index.ts'
import { rgbToHex } from '@lib/theme/colorUtils/rgbToHex.ts'
import { hexToCSS } from '@lib/theme/colorUtils/hexToCSS.ts'
import { updateCRTShaderUniforms } from '@lib/gl/shaders/CRTShader.ts'
import { updatePixelBleedShaderUniforms } from '@lib/gl/shaders/PixelBleedShader.ts'

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
    onFinalPassChange: (params) => {
      if (state.finalPass && state.finalPass.uniforms) {
        state.finalPass.uniforms.chromaStrength.value = params.chromaStrength
        state.finalPass.uniforms.gain.value = params.gain
        state.finalPass.uniforms.contrast.value = params.contrast
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

          log.debug(lc.GL_DEBUG, 'Video background selective colorization updated:', {
            enabled: params.enabled,
            brightnessWeight: params.targeting.brightnessWeight,
            saturationWeight: params.targeting.saturationWeight,
            brightnessThreshold: params.targeting.brightnessThreshold,
            saturationThreshold: params.targeting.saturationThreshold,
            blendBalance: params.colorBlending.blendBalance,
            blendMode: params.colorBlending.blendMode,
          })
        }
      }

      // Note: Removed final pass glitch effect control - that should be a separate effect
    },
    onVideoBackgroundOpacityChange: (opacity) => {
      // Update video background opacity
      if (state.videoBackground && state.videoBackground.mesh) {
        const material = state.videoBackground.mesh.material as Three.ShaderMaterial
        if (material && material.uniforms) {
          material.uniforms.opacity.value = opacity
          log.debug(lc.GL_DEBUG, 'Video background opacity updated:', opacity)
        }
      }
    },
    onCorruptionChange: (params) => {
      // Update CRT corruption shader uniforms
      if (state.crtPass && state.crtPass.material) {
        const material = state.crtPass.material as Three.ShaderMaterial
        updateCRTShaderUniforms(material, params)
        log.debug(lc.GL_DEBUG, 'CRT corruption uniforms updated:', params)
      }

      // Update pixel bleed shader uniforms AND enable/disable the pass
      if (state.pixelBleedPass && state.pixelBleedPass.material) {
        const material = state.pixelBleedPass.material as Three.ShaderMaterial
        updatePixelBleedShaderUniforms(material, params)

        // Enable/disable the pixel bleed pass based on the pixelBleedEnabled flag
        state.pixelBleedPass.enabled = params.pixelBleedEnabled && params.enabled

        log.debug(lc.GL_DEBUG, 'Pixel bleed uniforms updated:', params)
        log.debug(lc.GL_DEBUG, 'Pixel bleed pass enabled:', state.pixelBleedPass.enabled)
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
      liveFocusDistance: bokehPass.materialBokeh.uniforms.focus.value,
    })
  }

  // Initialize final pass parameters
  if (state.finalPass && state.finalPass.uniforms) {
    debugPanelsAPI.updateFinalPassParams({
      chromaStrength: state.finalPass.uniforms.chromaStrength.value,
      gain: state.finalPass.uniforms.gain.value,
      contrast: state.finalPass.uniforms.contrast.value,
    })
  }

  // Initialize selective colorization parameters
  if (state.videoBackground && state.videoBackground.mesh) {
    const material = state.videoBackground.mesh.material as Three.ShaderMaterial
    const glTheme = currentGLTheme.value

    log.debug(lc.GL_DEBUG, 'Theme colors for selective colorization:', {
      primary: glTheme.primary,
      secondary: glTheme.secondary,
      primaryHex: rgbToHex(glTheme.primary),
      secondaryHex: rgbToHex(glTheme.secondary),
      primaryCSS: hexToCSS(rgbToHex(glTheme.primary)),
      secondaryCSS: hexToCSS(rgbToHex(glTheme.secondary)),
    })

    // Initialize video background opacity
    const currentOpacity = material.uniforms.opacity?.value || 0.5
    debugPanelsAPI.updateVideoBackgroundOpacity(currentOpacity)

    // Update the debug panels with initial selective colorization values
    debugPanelsAPI.updateSelectiveColorizationParams(
      {
        enabled: material.uniforms.selectiveColorizationEnabled?.value === 1.0,
        useThemeColors: true,
        primaryTargetColor: hexToCSS(rgbToHex(glTheme.primary)),
        secondaryTargetColor: hexToCSS(rgbToHex(glTheme.secondary)),
        targeting: {
          brightnessWeight: material.uniforms.selectiveBrightnessWeight?.value || 0.5,
          saturationWeight: material.uniforms.selectiveSaturationWeight?.value || 0.5,
          brightnessThreshold: material.uniforms.selectiveBrightnessThreshold?.value || 0.5,
          saturationThreshold: material.uniforms.selectiveSaturationThreshold?.value || 0.5,
          blendSmoothness: material.uniforms.selectiveBlendSmoothness?.value || 0.1,
        },
        colorBlending: {
          blendMode: 'mixed',
          blendBalance: material.uniforms.selectiveBlendBalance?.value || 0.3,
        },
      },
      {
        highlight: hexToCSS(rgbToHex(glTheme.primary)),
        shadow: hexToCSS(rgbToHex(glTheme.secondary)),
      },
    )
  }

  // Initialize corruption parameters
  if (state.crtPass && state.crtPass.material) {
    const material = state.crtPass.material as Three.ShaderMaterial
    debugPanelsAPI.updateCorruptionParams({
      enabled: false,
      intensity: 0.0,
      timeEnabled: true,

      // Initialize from shader defaults - ALL DISABLED BY DEFAULT
      staticIntensity: material.uniforms.staticIntensity?.value || 0.0,
      rgbDistortionIntensity: material.uniforms.rgbDistortionIntensity?.value || 0.0,
      rgbDistortionEnabled: material.uniforms.rgbDistortionEnabled?.value === 1.0,
      whiteNoiseIntensity: material.uniforms.whiteNoiseIntensity?.value || 0.0,
      whiteNoiseEnabled: material.uniforms.whiteNoiseEnabled?.value === 1.0,
      blockCorruptionRate: material.uniforms.blockCorruptionRate?.value || 0.0,
      blockCorruptionEnabled: material.uniforms.blockCorruptionEnabled?.value === 1.0,
      waveNoiseIntensity: material.uniforms.waveNoiseIntensity?.value || 0.0,
      waveNoiseEnabled: material.uniforms.waveNoiseEnabled?.value === 1.0,
      shakeIntensity: material.uniforms.shakeIntensity?.value || 0.0,
      shakeEnabled: material.uniforms.shakeEnabled?.value === 1.0,

      // Large block corruption
      largeBlockIntensity: material.uniforms.largeBlockIntensity?.value || 0.0,
      largeBlockSize: material.uniforms.largeBlockSize?.value || 20.0,
      largeBlockFPS: material.uniforms.largeBlockFPS?.value || 10.0,
      largeBlockEnabled: false,

      // Artifact noise
      artifactNoiseIntensity: material.uniforms.artifactNoiseIntensity?.value || 0.0,
      artifactChunkSize: material.uniforms.artifactChunkSize?.value || 50.0,
      artifactShiftAmount: material.uniforms.artifactShiftAmount?.value || 0.5,
      artifactNoiseFPS: material.uniforms.artifactNoiseFPS?.value || 10.0,
      artifactNoiseEnabled: false,

      // Pixel bleed (from pixel bleed pass if available, otherwise use defaults)
      pixelBleedIntensity: state.pixelBleedPass?.material?.uniforms?.intensity?.value || 0.0,
      pixelBleedChunkSize: state.pixelBleedPass?.material?.uniforms?.chunkSize?.value || 20.0,
      pixelBleedChunkRandomness: state.pixelBleedPass?.material?.uniforms?.chunkRandomness?.value || 0.5,
      pixelBleedStretchDistance: state.pixelBleedPass?.material?.uniforms?.stretchDistance?.value || 0.3,
      pixelBleedGeometryComplexity: state.pixelBleedPass?.material?.uniforms?.geometryComplexity?.value || 0.5,
      pixelBleedPersistence: state.pixelBleedPass?.material?.uniforms?.persistence?.value || 0.5,
      pixelBleedRegenerationRate: state.pixelBleedPass?.material?.uniforms?.regenerationRate?.value || 0.4,
      pixelBleedEnabled: false,
    })
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

    // Video background information
    let videoInfo = '<b>Video Background:</b> Not available'
    log.debug(lc.GL_DEBUG, 'Debug system checking video background:', state.videoBackground)
    log.debug(
      lc.GL_DEBUG,
      'Video background has getDebugInfo:',
      state.videoBackground && typeof state.videoBackground.getDebugInfo === 'function',
    )
    if (state.videoBackground && state.videoBackground.getDebugInfo) {
      const vDebug = state.videoBackground.getDebugInfo()
      const segmentProgress = vDebug.timeSinceSwitch / (vDebug.currentDuration * 1000) * 100
      const progressBar = createVideoProgressBar(vDebug)

      // Anti-repeat blocked videos
      const blockedVideos = Array.from({ length: vDebug.totalVideos }, (_, i) => i)
        .filter((i) => vDebug.recentIndices.includes(i) && i !== vDebug.currentVideoIndex)
        .map((i) => `#${i}`)
        .join(', ')

      // Get next prepared video name
      const nextPreparedInfo = vDebug.nextPreparedIndex !== null ? `#${vDebug.nextPreparedIndex}` : 'None'

      videoInfo = [
        `<b>Video Background:</b>`,
        `<b>Current:</b> #${vDebug.currentVideoIndex} - ${vDebug.currentVideoName}`,
        `<b>Status:</b> ${vDebug.isPlaying ? 'Playing' : 'Paused'} ${vDebug.isTransitioning ? '(Transitioning)' : ''}`,
        `<b>Segment:</b> ${(vDebug.timeSinceSwitch / 1000).toFixed(1)}s / ${vDebug.currentDuration.toFixed(1)}s (${
          segmentProgress.toFixed(1)
        }%)`,
        `<b>Full Video:</b> ${vDebug.fullVideoDuration.toFixed(1)}s | Start: ${vDebug.videoStartTime.toFixed(1)}s`,
        progressBar,
        `<b>Next Prepared:</b> ${nextPreparedInfo}`,
        `<b>Total Videos:</b> ${vDebug.totalVideos} loaded`,
        `<b>Recent History:</b> [${vDebug.recentIndices.join(', ')}]`,
        `<b>Anti-Repeat Blocked:</b> ${blockedVideos || 'None'}`,
      ].join('<br>')
    } else {
      log.debug(lc.GL_DEBUG, 'Video background debug info not available. Reasons:')
      log.debug(lc.GL_DEBUG, '- state.videoBackground exists:', !!state.videoBackground)
      log.debug(
        lc.GL_DEBUG,
        '- state.videoBackground.getDebugInfo exists:',
        state.videoBackground && typeof state.videoBackground.getDebugInfo === 'function',
      )
    }

    // Scene elements information
    const sceneElements = scene.children
      .map((child: Three.Object3D, index: number) => {
        const type = child.type
        const name = child.name || `unnamed_${type}_${index}`
        const position = `(${child.position.x.toFixed(2)}, ${child.position.y.toFixed(2)}, ${child.position.z.toFixed(2)})`
        const visible = child.visible ? '✓' : '✗'
        const opacity = child.material?.uniforms?.opacity?.value ? `opacity=${child.material.uniforms.opacity.value.toFixed(2)}` : ''
        return `${visible} ${name}: ${type} ${position} ${opacity}`
      })
      .join('<br>')

    const debugContent = [
      cameraInfo,
      '<br/>',
      videoInfo,
      '<br/><b>Scene Elements:</b>',
      sceneElements || 'No scene elements',
    ].join('<br>')

    debugPanelsAPI.setDebugInfo(debugContent)
  }

  // Create a visual progress bar showing video segment within full video
  const createVideoProgressBar = (vDebug: VideoDebugInfo) => {
    const barWidth = 40 // characters

    // Calculate positions within the full video (0-1 range)
    const segmentStart = vDebug.videoStartTime / vDebug.fullVideoDuration
    const segmentEnd = (vDebug.videoStartTime + vDebug.currentDuration) / vDebug.fullVideoDuration
    const currentPos = (vDebug.videoStartTime + (vDebug.timeSinceSwitch / 1000)) / vDebug.fullVideoDuration

    // Clamp values to prevent overflow
    const clampedSegmentStart = Math.max(0, Math.min(1, segmentStart))
    const clampedSegmentEnd = Math.max(0, Math.min(1, segmentEnd))
    const clampedCurrentPos = Math.max(0, Math.min(1, currentPos))

    // Create the full video bar using a simpler approach
    let bar = ''
    for (let i = 0; i < barWidth; i++) {
      const pos = i / barWidth // Simplified position calculation

      if (pos < clampedSegmentStart || pos > clampedSegmentEnd) {
        // Outside visible segment
        bar += `<span style="color: #666666;">░</span>` // Hidden
      } else if (pos <= clampedCurrentPos) {
        // Within segment and played
        bar += `<span style="color: #00ff00;">█</span>` // Played portion of segment
      } else {
        // Within segment but not yet played
        bar += `<span style="color: #ffaa00;">▓</span>` // Remaining portion of segment
      }
    }

    const segmentProgress = vDebug.timeSinceSwitch / (vDebug.currentDuration * 1000) * 100

    return [
      `<div style="font-family: monospace; background: rgba(0,100,255,0.1); padding: 4px 6px; border-radius: 4px; margin: 2px 0;">`,
      `<div style="display: inline-block; margin-right: 8px;"><span style="color: #00ff00;">█</span> Played</div>`,
      `<div style="display: inline-block; margin-right: 8px;"><span style="color: #ffaa00;">▓</span> Segment</div>`,
      `<div style="display: inline-block;"><span style="color: #666666;">░</span> Hidden</div>`,
      `<div style="letter-spacing: 1px; margin-top: 4px;">${bar}</div>`,
      `<div style="font-size: 10px; margin-top: 2px;">Segment: ${segmentProgress.toFixed(1)}% complete</div>`,
      `</div>`,
    ].join('')
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
