import * as Three from 'three'
import videoCycleConfig from '@libgl/configVideoCycle.json' with { type: 'json' }
import { getBaselineDimensions } from './utils/getBaselineDimensions.ts'
import { calculateFarPlaneSize } from './utils/calculateFarPlaneSize.ts'
import { createVideoCycle } from '@libgl/textures/VideoCycle/index.ts'
import type { VideoBackgroundManager } from '@libgl/types.ts'
import {
  selectiveVideoBackgroundFragmentShader,
  selectiveVideoBackgroundVertexShader,
} from '@libgl/shaders/SelectiveVideoBackgroundShader.ts'
import { currentGLTheme } from '@lib/theme/index.ts'
import configScene from '@libgl/configScene.json' with { type: 'json' }

/**
 * Creates a dual-buffer video background system with seamless cycling and responsive scaling.
 *
 * Sets up two video planes (front and back buffers) for smooth video transitions without
 * interruption. Handles responsive scaling to ensure video coverage across all viewport sizes
 * with 10% overflow to prevent edge artifacts. Integrates with the VideoCycle system for
 * automatic video loading, cycling, and texture management. Returns a manager that provides
 * update and disposal methods for the complete video background lifecycle.
 * Returns undefined if video bac kgrounds are disabled in configuration.
 */
export const createVideoBackground = (
  THREE: typeof Three,
  scene: Three.Scene,
): VideoBackgroundManager | undefined => {
  if (!videoCycleConfig.enabled) return undefined

  // Get baseline dimensions including video plane sizing
  const { videoPlaneWidth, videoPlaneHeight } = getBaselineDimensions()

  // Create two video planes - one for active display, one for buffering
  const createPlane = (name: string) => {
    const geometry = new THREE.PlaneGeometry(videoPlaneWidth, videoPlaneHeight)

    // Get selective colorization config and theme
    const { selectiveColorization } = configScene.postProcessingConfig as any
    const glTheme = currentGLTheme.value

    // Determine colors based on configuration
    const useThemeColors = selectiveColorization?.useThemeColors === true
    const primaryColor = useThemeColors
      ? new THREE.Color().setRGB(glTheme.primary.r, glTheme.primary.g, glTheme.primary.b)
      : selectiveColorization?.primaryTargetColor
      ? new THREE.Color(selectiveColorization.primaryTargetColor)
      : new THREE.Color().setRGB(glTheme.primary.r, glTheme.primary.g, glTheme.primary.b)

    const secondaryColor = useThemeColors
      ? new THREE.Color().setRGB(glTheme.accent.r, glTheme.accent.g, glTheme.accent.b)
      : selectiveColorization?.secondaryTargetColor
      ? new THREE.Color(selectiveColorization.secondaryTargetColor)
      : new THREE.Color().setRGB(glTheme.accent.r, glTheme.accent.g, glTheme.accent.b)

    // Convert blend mode string to number
    const blendModeMap: { [key: string]: number } = { brightness: 0, saturation: 1, mixed: 2 }
    const blendModeValue = blendModeMap[selectiveColorization?.colorBlending?.blendMode] ?? 2

    const material = new THREE.ShaderMaterial({
      uniforms: {
        videoTexture: { value: null },
        opacity: { value: 0 },
        selectiveColorizationEnabled: { value: selectiveColorization?.enabled ? 1.0 : 0.0 },
        selectivePrimaryColor: { value: primaryColor.toArray() },
        selectiveSecondaryColor: { value: secondaryColor.toArray() },
        selectiveBrightnessWeight: { value: selectiveColorization?.targeting?.brightnessWeight ?? 0.6 },
        selectiveSaturationWeight: { value: selectiveColorization?.targeting?.saturationWeight ?? 0.8 },
        selectiveBrightnessThreshold: { value: selectiveColorization?.targeting?.brightnessThreshold ?? 0.7 },
        selectiveSaturationThreshold: { value: selectiveColorization?.targeting?.saturationThreshold ?? 0.5 },
        selectiveBlendSmoothness: { value: selectiveColorization?.targeting?.blendSmoothness ?? 0.1 },
        selectiveBlendMode: { value: blendModeValue },
        selectiveBlendBalance: { value: selectiveColorization?.colorBlending?.blendBalance ?? 0.3 },
      },
      vertexShader: selectiveVideoBackgroundVertexShader,
      fragmentShader: selectiveVideoBackgroundFragmentShader,
      transparent: true,
      side: THREE.FrontSide,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = name
    mesh.position.z = videoCycleConfig.position.z
    scene.add(mesh)

    return { mesh, material, geometry }
  }

  const frontBuffer = createPlane('VideoBackgroundFront')
  const backBuffer = createPlane('VideoBackgroundBack')

  // Track previous theme colors for efficient updates
  let lastThemeColors: { primary: string; accent: string } | null = null

  // Update theme colors for selective colorization in real-time
  const updateThemeColors = () => {
    const { selectiveColorization } = configScene.postProcessingConfig as any
    if (!selectiveColorization?.enabled) return

    const useThemeColors = selectiveColorization?.useThemeColors === true
    if (!useThemeColors) return // Only update if using theme colors

    const glTheme = currentGLTheme.value

    // Create color signature for comparison
    const currentThemeColors = {
      primary: `${glTheme.primary.r},${glTheme.primary.g},${glTheme.primary.b}`,
      accent: `${glTheme.accent.r},${glTheme.accent.g},${glTheme.accent.b}`,
    }

    // Only update if colors have actually changed
    if (
      lastThemeColors &&
      lastThemeColors.primary === currentThemeColors.primary &&
      lastThemeColors.accent === currentThemeColors.accent
    ) {
      return
    }

    const primaryColor = new THREE.Color().setRGB(glTheme.primary.r, glTheme.primary.g, glTheme.primary.b)
    const secondaryColor = new THREE.Color().setRGB(glTheme.accent.r, glTheme.accent.g, glTheme.accent.b)

    // Update uniforms for both materials
    if ('uniforms' in frontBuffer.material) {
      frontBuffer.material.uniforms.selectivePrimaryColor.value = primaryColor.toArray()
      frontBuffer.material.uniforms.selectiveSecondaryColor.value = secondaryColor.toArray()
    }
    if ('uniforms' in backBuffer.material) {
      backBuffer.material.uniforms.selectivePrimaryColor.value = primaryColor.toArray()
      backBuffer.material.uniforms.selectiveSecondaryColor.value = secondaryColor.toArray()
    }

    // Update the last known colors
    lastThemeColors = currentThemeColors
  }

  // Handle resize to update plane scales
  const handleResize = () => {
    const { cameraZ, fov } = getBaselineDimensions()

    // Calculate the size needed to cover the current viewport
    const requiredSize = calculateFarPlaneSize(fov, cameraZ, videoCycleConfig.position.z)

    // Calculate scale factors based on current plane size vs required size
    const scaleX = (requiredSize.width * 1.1) / videoPlaneWidth // 10% overflow
    const scaleY = (requiredSize.height * 1.1) / videoPlaneHeight // 10% overflow

    // Use the larger scale to ensure full coverage
    const scale = Math.max(scaleX, scaleY)
    const configScale = videoCycleConfig.position.scale || 1
    const finalScale = scale * configScale

    // Apply scale to both planes
    frontBuffer.mesh.scale.set(finalScale, finalScale, 1)
    backBuffer.mesh.scale.set(finalScale, finalScale, 1)
  }

  // Initial scale setup
  handleResize()

  // Add resize listener
  globalThis.addEventListener('resize', handleResize)

  // Now pass the planes to VideoCycle for texture management
  const videoCycle = createVideoCycle(frontBuffer, backBuffer)

  // Return manager with dispose that includes our cleanup
  return {
    update: videoCycle.update,
    dispose: () => {
      globalThis.removeEventListener('resize', handleResize)

      // Remove planes from scene
      scene.remove(frontBuffer.mesh)
      scene.remove(backBuffer.mesh)

      // Dispose geometries and materials
      frontBuffer.geometry.dispose()
      frontBuffer.material.dispose()
      backBuffer.geometry.dispose()
      backBuffer.material.dispose()

      // Dispose video cycle
      videoCycle.dispose()
    },
    mesh: frontBuffer.mesh,
    handleResize,
    updateThemeColors,
  }
}
