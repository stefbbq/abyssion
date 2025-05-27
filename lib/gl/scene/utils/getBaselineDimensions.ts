import sceneConfig from '@lib/sceneConfig.json' with { type: 'json' }

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
 * Returns baseline dimensions for a typical 16:9 desktop setup
 *
 * This function provides the foundational dimensions that work well for
 * a standard desktop viewing experience. These dimensions are used as
 * the base for all responsive calculations.
 *
 * The baseline assumes:
 * - 16:9 aspect ratio screen
 * - Desktop viewing distance
 * - Standard FOV and camera positioning
 * - Logo sized appropriately for the viewport
 */
export const getBaselineDimensions = (): ResponsiveDimensions => {
  const { planeWidth, planeHeight, cameraConfig } = sceneConfig

  // Use the configured baseline dimensions
  const logoWidth = planeWidth // 8 units
  const logoHeight = planeHeight // ~5.12 units (8 / 1.5625 aspect ratio)

  // Use configured camera settings as baseline
  const fov = cameraConfig.fov // 60 degrees
  const cameraZ = cameraConfig.position.z // 5 units

  // Calculate video plane size to cover the viewport at baseline camera distance
  // For a 16:9 screen at 60° FOV and camera distance of 5 units
  const fovRad = (fov * Math.PI) / 180
  const baselineAspect = 16 / 9 // Standard desktop aspect ratio

  // Calculate visible area at camera distance
  const visibleHeight = 2 * Math.tan(fovRad / 2) * cameraZ
  const visibleWidth = visibleHeight * baselineAspect

  // Size video plane to cover visible area with some overflow
  const videoPlaneWidth = visibleWidth * 1.2 // 20% overflow
  const videoPlaneHeight = visibleHeight * 1.2 // 20% overflow

  return {
    planeWidth: logoWidth,
    planeHeight: logoHeight,
    videoPlaneWidth,
    videoPlaneHeight,
    cameraZ,
    fov,
    scale: 1.0, // Baseline scale
  }
}
