/**
 * Calculates the plane size needed to cover the field of view at given distances
 *
 * Use this function when you need to:
 * - Scale video backgrounds to cover the viewport
 * - Calculate responsive plane sizes for different camera/plane positions
 * - Determine how big something needs to be to fill the screen
 *
 * @param fov - Field of view in degrees
 * @param cameraZ - Camera Z position
 * @param planeZ - Plane Z position (default: 0)
 * @returns Object with width and height needed to cover the FOV
 */
export const calculateFarPlaneSize = (
  fov: number,
  cameraZ: number,
  planeZ: number = 0,
): { width: number; height: number } => {
  const distance = Math.abs(cameraZ - planeZ)
  const fovRad = (fov * Math.PI) / 180

  // Calculate size needed to cover the field of view
  const height = 2 * distance * Math.tan(fovRad / 2)

  // Get current screen aspect ratio
  const width = height * 1.7777777777777777

  return { width, height }
}
