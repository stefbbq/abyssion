import * as Three from 'three'
import { debugPanelsAPI } from '@islands/DebugPanels.tsx'
import configScene from '@libgl/configScene.json' with { type: 'json' }
import type { ConfigScene } from '@libgl/configScene.types.ts'
import type { LogoController } from '@libgl/layers/LogoLayer.ts'
import type { RendererState } from '@libgl/types.ts'
import type { VideoCycleDebugInfo } from '@libgl/textures/VideoCycle/types.ts'
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
        const pixelBleedConfig = {
          intensity: params.pixelBleedIntensity,
          chunkSize: params.pixelBleedChunkSize,
          chunkRandomness: params.pixelBleedChunkRandomness,
          stretchDistance: params.pixelBleedStretchDistance,
          geometryComplexity: params.pixelBleedGeometryComplexity,
          persistence: params.pixelBleedPersistence,
          regenerationRate: params.pixelBleedRegenerationRate,
        }
        updatePixelBleedShaderUniforms(material, pixelBleedConfig)

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
      '<br/><b>Scene Elements:</b>',
      sceneElements || 'No scene elements',
    ].join('<br>')

    debugPanelsAPI.setDebugInfo(debugContent)

    // Handle video debug info separately
    updateVideoDebugInfo()
  }

  // Separate video debug info updater with comprehensive information
  const updateVideoDebugInfo = () => {
    let videoInfo = '<b>Video Background:</b> Not available'

    if (state.videoBackground && state.videoBackground.getDebugInfo) {
      try {
        const vDebug = state.videoBackground.getDebugInfo()

        // Format timing values for display
        const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}s`
        const formatMs = (ms: number) => `${ms.toFixed(0)}ms`

        // Create detailed progress bar
        const progressBar = createEnhancedVideoProgressBar(vDebug)

        // Anti-repeat blocked videos
        const blockedVideos = Array.from({ length: vDebug.poolSize }, (_, i) => i)
          .filter((i) => vDebug.recentIndices.includes(i) && i !== vDebug.currentVideoIndex)
          .map((i) => `#${i}`)
          .join(', ')

        // Current video section
        const currentVideoSection = `<div style="background: rgba(0,150,255,0.1); padding: 4px 6px; border-radius: 4px; margin: 1px 0;">
          <div><b><u>CURRENT VIDEO</u></b></div>
          <div><b>Video:</b> #${vDebug.currentVideoIndex} - ${vDebug.currentVideoName}</div>
          <div><b>Status:</b> ${vDebug.isPlaying ? '▶️ Playing' : '⏸️ Paused'}</div>
          <div><b>Segment:</b> ${formatTime(vDebug.timeSinceSwitch)} / ${formatTime(vDebug.currentDuration * 1000)} (${
          vDebug.segmentProgressPercent.toFixed(1)
        }%)</div>
          <div><b>Segment Range:</b> ${vDebug.currentStartTime.toFixed(1)}s - ${vDebug.currentSegmentEndTime.toFixed(1)}s</div>
          <div><b>Full Video Length:</b> ${vDebug.fullVideoDuration.toFixed(1)}s</div>
          ${progressBar}
        </div>`

        // Next video section
        const nextVideoSection = `<div style="background: rgba(255,150,0,0.1); padding: 4px 6px; border-radius: 4px; margin: 1px 0;">
          <div><b><u>NEXT VIDEO</u></b></div>
          <div>${
          vDebug.nextPreparedIndex !== null
            ? `<b>Queued:</b> #${vDebug.nextPreparedIndex} - ${vDebug.nextPreparedVideoName}`
            : `<b>Queued:</b> None prepared`
        }</div>
          <div>${
          vDebug.nextVideoFullDuration ? `<b>Duration:</b> ${vDebug.nextVideoFullDuration.toFixed(1)}s` : `<b>Duration:</b> Unknown`
        }</div>
          <div><b>Triggers in:</b> ${formatMs(vDebug.timeUntilNextVideo)}</div>
          <div><b>Buffer swap in:</b> ${formatMs(vDebug.timeUntilBufferSwap)}</div>
        </div>`

        // Buffer states section
        const bufferSection = `<div style="background: rgba(150,255,0,0.1); padding: 4px 6px; border-radius: 4px; margin: 1px 0;">
          <div><b><u>BUFFER STATES</u></b></div>
          <div><b>Active (${vDebug.activeBuffer.name}):</b> ${vDebug.activeBuffer.videoName || 'Empty'} (opacity: ${
          vDebug.activeBuffer.opacity.toFixed(2)
        })</div>
          <div><b>Hidden (${vDebug.hiddenBuffer.name}):</b> ${vDebug.hiddenBuffer.videoName || 'Empty'} (opacity: ${
          vDebug.hiddenBuffer.opacity.toFixed(2)
        })</div>
        </div>`

        // History and anti-repeat section
        const historySection = `<div style="background: rgba(255,0,150,0.1); padding: 4px 6px; border-radius: 4px; margin: 1px 0;">
          <div><b><u>HISTORY & ANTI-REPEAT</u></b></div>
          <div><b>Recent History:</b> [${vDebug.recentIndices.join(', ')}]</div>
          <div><b>Anti-Repeat Blocked:</b> ${blockedVideos || 'None'} (${vDebug.antiRepeatCount} videos)</div>
        </div>`

        // Pool status section
        const poolSection = `<div style="background: rgba(150,0,255,0.1); padding: 4px 6px; border-radius: 4px; margin: 1px 0;">
          <div><b><u>VIDEO POOL</u></b></div>
          <div><b>Pool Size:</b> ${vDebug.poolSize} videos loaded</div>
          <div><b>Manifest Remaining:</b> ${vDebug.manifestRemaining} videos</div>
          <div><b>Total Available:</b> ${vDebug.totalVideos} videos</div>
          <div><b>Loading:</b> ${
          'loadingProgress' in vDebug && (vDebug.loadingProgress as { hasMoreToLoad: boolean } | undefined)?.hasMoreToLoad
            ? '🔄 In Progress'
            : '✅ Complete'
        }</div>
        </div>`

        videoInfo = [
          currentVideoSection,
          nextVideoSection,
          bufferSection,
          historySection,
          poolSection,
        ].join('')
      } catch (error) {
        log.error(lc.GL_DEBUG, 'Error getting video debug info:', error)
        videoInfo = '<b>Video Background:</b> Error retrieving debug info'
      }
    }

    debugPanelsAPI.setVideoDebugInfo(videoInfo)
  }

  // Create an enhanced visual progress bar showing video segment within full video
  const createEnhancedVideoProgressBar = (vDebug: VideoCycleDebugInfo) => {
    const barWidth = 50 // characters

    // Calculate positions within the full video (0-1 range)
    const segmentStart = vDebug.currentStartTime / vDebug.fullVideoDuration
    const segmentEnd = vDebug.currentSegmentEndTime / vDebug.fullVideoDuration
    const currentPos = (vDebug.currentStartTime + (vDebug.timeSinceSwitch / 1000)) / vDebug.fullVideoDuration

    // Clamp values to prevent overflow
    const clampedSegmentStart = Math.max(0, Math.min(1, segmentStart))
    const clampedSegmentEnd = Math.max(0, Math.min(1, segmentEnd))
    const clampedCurrentPos = Math.max(0, Math.min(1, currentPos))

    // Create the full video bar
    let bar = ''
    for (let i = 0; i < barWidth; i++) {
      const pos = i / barWidth

      if (pos < clampedSegmentStart || pos > clampedSegmentEnd) {
        // Outside visible segment
        bar += `<span style="color: #444444;">░</span>` // Hidden
      } else if (pos <= clampedCurrentPos) {
        // Within segment and played
        bar += `<span style="color: #00ff00;">█</span>` // Played portion of segment
      } else {
        // Within segment but not yet played
        bar += `<span style="color: #ffaa00;">▓</span>` // Remaining portion of segment
      }
    }

    return [
      `<div style="font-family: monospace; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; margin: 4px 0; border: 1px solid rgba(255,255,255,0.1);">`,
      `<div style="display: flex; gap: 12px; font-size: 10px; margin-bottom: 2px;">`,
      `<span><span style="color: #00ff00;">█</span> Played</span>`,
      `<span><span style="color: #ffaa00;">▓</span> Remaining</span>`,
      `<span><span style="color: #444444;">░</span> Hidden</span>`,
      `</div>`,
      `<div style="letter-spacing: 0.5px; margin: 2px 0;">${bar}</div>`,
      `<div style="font-size: 9px; color: #aaa;">Progress: ${vDebug.segmentProgressPercent.toFixed(1)}%</div>`,
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
