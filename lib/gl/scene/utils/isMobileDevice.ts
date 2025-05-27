/**
 * Detects if the current device is a mobile device based on comprehensive criteria
 *
 * This function uses multiple detection methods to accurately identify mobile devices:
 * - User agent string analysis for known mobile platforms
 * - Screen size thresholds (768px or smaller in any dimension)
 * - Touch capability detection
 *
 * The function is designed to work in both browser and server-side rendering contexts,
 * gracefully handling cases where global objects may not be available.
 *
 * @returns {boolean} True if the device is detected as mobile, false otherwise
 *
 * @example
 * ```typescript
 * import { isMobileDevice } from './utils/isMobileDevice'
 *
 * if (isMobileDevice()) {
 *   // Apply mobile-specific 3D scene optimizations
 *   camera.position.z = 7
 *   logoScale = 0.7
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Use in responsive component
 * const MobileOptimizedScene = () => {
 *   const isMobile = isMobileDevice()
 *   const particleCount = isMobile ? 100 : 500
 *   return createParticleSystem(particleCount)
 * }
 * ```
 *
 * @since 1.0.0
 * @public
 */
export const isMobileDevice = (): boolean => {
  // Handle server-side rendering or environments without global objects
  if (typeof globalThis === 'undefined' || !globalThis.navigator) {
    return false
  }

  // Extract user agent string safely
  const userAgent = globalThis.navigator.userAgent || ''

  // Check for known mobile user agent patterns
  // Covers major mobile platforms: Android, iOS, Windows Mobile, BlackBerry, etc.
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

  // Check screen size - mobile devices typically have smaller screens
  // Using 768px as threshold (common tablet/mobile breakpoint)
  const isSmallScreen = globalThis.innerWidth <= 768 || globalThis.innerHeight <= 768

  // Check for touch capabilities - most mobile devices support touch
  const isTouchDevice = 'ontouchstart' in globalThis ||
    (globalThis.navigator && globalThis.navigator.maxTouchPoints > 0)

  // Device is considered mobile if it has mobile UA OR (small screen AND touch)
  // This catches edge cases like small touch laptops vs large tablets
  return isMobileUA || (isSmallScreen && isTouchDevice)
}
