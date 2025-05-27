import { PLANE_HEIGHT, PLANE_WIDTH } from '../config.ts'

/**
 * Responsive dimension configuration for 3D scene elements
 *
 * @interface ResponsiveDimensions
 * @public
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
 * Calculates responsive dimensions and camera settings based on device characteristics
 *
 * This function analyzes the current device and screen configuration to determine
 * optimal 3D scene parameters. It considers:
 * - Device type (mobile vs desktop)
 * - Screen orientation (portrait vs landscape)
 * - Screen aspect ratio (ultrawide, standard, tall)
 * - Performance considerations for mobile devices
 *
 * The returned configuration ensures the logo and scene elements are:
 * - Properly sized for the screen
 * - Positioned for optimal viewing
 * - Performance-optimized for the device type
 */
export const getResponsiveDimensions = (): ResponsiveDimensions => {
  // Get current screen dimensions
  const screenWidth = globalThis.innerWidth
  const screenHeight = globalThis.innerHeight
  const screenAspect = screenWidth / screenHeight

  // Always use the same logo size - no warping!
  const logoWidth = PLANE_WIDTH
  const logoHeight = PLANE_HEIGHT

  // Calculate the camera distance needed to fit the logo with 10% padding
  const fov = 60 // Standard FOV for all devices
  const fovRad = (fov * Math.PI) / 180

  // Calculate required distance for both width and height constraints
  const requiredDistanceForWidth = (logoWidth * 1.1) / (2 * Math.tan(fovRad / 2) * screenAspect)
  const requiredDistanceForHeight = (logoHeight * 1.1) / (2 * Math.tan(fovRad / 2))

  // Use the larger distance to ensure both dimensions fit comfortably
  const optimalCameraZ = Math.max(requiredDistanceForWidth, requiredDistanceForHeight, 4) // Minimum distance of 4

  // Calculate video plane dimensions to cover the viewport
  // Video is 16:9, we need to size it to cover the logo area with overflow
  const videoAspect = 16 / 9
  const logoAspect = logoWidth / logoHeight

  let videoPlaneWidth, videoPlaneHeight
  if (logoAspect > videoAspect) {
    // Logo area is wider than video - fit to width
    videoPlaneWidth = logoWidth * 1.2 // 20% overflow
    videoPlaneHeight = videoPlaneWidth / videoAspect
  } else {
    // Logo area is taller than video - fit to height
    videoPlaneHeight = logoHeight * 1.2 // 20% overflow
    videoPlaneWidth = videoPlaneHeight * videoAspect
  }

  return {
    planeWidth: logoWidth,
    planeHeight: logoHeight,
    videoPlaneWidth,
    videoPlaneHeight,
    cameraZ: optimalCameraZ,
    fov: fov,
    scale: 1.0, // Always full scale since we're adjusting camera distance instead
  }
}
