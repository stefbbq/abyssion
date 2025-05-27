/**
 * Calculate responsive camera Z position based on aspect ratio
 *
 * This function determines the optimal camera distance for different screen aspect ratios
 * to maintain consistent logo sizing across devices. The camera pulls back as screens
 * get narrower to prevent the logo from appearing too large or getting cropped.
 *
 * Breakpoints:
 * - Wide screens (≥1.33): Z = 5 (baseline)
 * - 1200x900 to 1000x900: Z = 5 to 5.4
 * - 1000x900 to square: Z = 5.4 to 6.1
 * - Square to iPad vertical: Z = 6.1 to 8.2
 * - iPad vertical to iPhone 14 Pro Max: Z = 8.2 to 14
 * - iPhone 14 Pro Max to Pixel 7: Z = 14 to 14.7
 * - Very narrow screens: Z = 14.7
 *
 * @param aspect - The screen aspect ratio (width / height)
 * @returns The optimal camera Z position
 */
export const getResponsiveCameraZ = (aspect: number): number => {
  if (aspect >= 1.33) {
    // Wide screens: 1200x900 and wider
    return 5
  } else if (aspect >= 1.11) {
    // 1000x900 to 1200x900: interpolate between 5.4 and 5
    return 5.4 + (aspect - 1.11) * (5 - 5.4) / (1.33 - 1.11)
  } else if (aspect >= 1.0) {
    // 1000x900 to square: interpolate between 6.1 and 5.4
    return 6.1 + (aspect - 1.0) * (5.4 - 6.1) / (1.11 - 1.0)
  } else if (aspect >= 0.75) {
    // Square to iPad vertical: interpolate between 8.2 and 6.1
    return 8.2 + (aspect - 0.75) * (6.1 - 8.2) / (1.0 - 0.75)
  } else if (aspect >= 0.46) {
    // iPad vertical to iPhone 14 Pro Max: interpolate between 14 and 8.2
    return 14 + (aspect - 0.46) * (8.2 - 14) / (0.75 - 0.46)
  } else if (aspect >= 0.43) {
    // iPhone 14 Pro Max to Pixel 7: interpolate between 14.7 and 14
    return 14.7 + (aspect - 0.43) * (14 - 14.7) / (0.46 - 0.43)
  } else {
    // Very narrow screens: use ~Pixel 7 value
    return 14.7
  }
}
