import sceneConfig from '@libgl/sceneConfig.json' with { type: 'json' }
import { calculateFarPlaneSize } from './calculateFarPlaneSize.ts'
import { getResponsiveCameraZ } from './getResponsiveCameraZ.ts'

/**
 * Responsive dimension configuration for 3D scene elements
 */
export interface ResponsiveDimensions {
  /** Width of the logo plane in world units */
  planeWidth: number
  /** Height of the logo plane in world units */
  planeHeight: number
  /** Width of the video plane in world units (16:9 aspect, sized to cover viewport) */
  videoPlaneWidth: number
  /** Height of the video plane in world units (16:9 aspect, sized to cover viewport) */
  videoPlaneHeight: number
  /** Camera Z position for optimal viewing distance */
  cameraZ: number
  /** Camera field of view in degrees */
  fov: number
  /** Overall scale factor for scene elements */
  scale: number
}

/**
 * Returns responsive dimensions based on current viewport and configuration
 *
 * This function provides responsive dimensions that adapt to different screen
 * aspect ratios and orientations. It uses the configured baseline values as
 * defaults but calculates optimal camera positioning and plane sizing for
 * the current viewport.
 *
 * The function:
 * - Uses responsive camera Z positioning based on aspect ratio
 * - Calculates video plane size to cover the current viewport
 * - Maintains logo dimensions from configuration
 * - Provides overflow for video backgrounds to ensure full coverage
 */
export const getBaselineDimensions = (): ResponsiveDimensions => {
  const { planeWidth, planeHeight } = sceneConfig

  // Use defaults as specified
  const fov = 60

  // Get current screen aspect ratio
  const screenAspect = globalThis.innerWidth / globalThis.innerHeight

  // Calculate responsive camera Z position based on aspect ratio
  const cameraZ = getResponsiveCameraZ(screenAspect)

  // Calculate plane size needed to cover the current viewport
  const farPlaneSize = calculateFarPlaneSize(fov, cameraZ, 0)

  // Size video plane to cover visible area with overflow for seamless coverage
  const videoPlaneWidth = farPlaneSize.width
  const videoPlaneHeight = farPlaneSize.height

  return {
    planeWidth, // Logo width from config
    planeHeight, // Logo height from config
    videoPlaneWidth,
    videoPlaneHeight,
    cameraZ,
    fov,
    scale: 1.0, // Baseline scale
  }
}
