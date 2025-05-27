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
 */
export const isMobileDevice = (): boolean => {
  // Handle server-side rendering or environments without global objects
  if (typeof globalThis === 'undefined' || !globalThis.navigator) return false

  const userAgent = globalThis.navigator.userAgent || ''
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isSmallScreen = globalThis.innerWidth <= 768 || globalThis.innerHeight <= 768
  const isTouchDevice = 'ontouchstart' in globalThis || (globalThis.navigator && globalThis.navigator.maxTouchPoints > 0)

  // Device is considered mobile if it has mobile UA OR (small screen AND touch)
  // This catches edge cases like small touch laptops vs large tablets
  return isMobileUA || (isSmallScreen && isTouchDevice)
}
