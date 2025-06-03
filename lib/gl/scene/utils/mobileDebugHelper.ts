import { isMobileDevice } from './isMobileDevice.ts'
import { getBaselineDimensions } from './getBaselineDimensions.ts'
import { lc, log } from '../../../logger/index.ts'

let resizeTimeout: number | null = null

/**
 * Logs comprehensive mobile detection and responsive dimension information
 *
 * This function outputs detailed debugging information about:
 * - Device detection results
 * - Screen dimensions and characteristics
 * - Calculated responsive dimensions
 * - Camera and scaling settings
 *
 * Use this function to troubleshoot mobile responsiveness issues,
 * especially when the logo is not visible or improperly sized.
 */
export const debugMobileResponsiveness = (): void => {
  console.group('🔍 Mobile Responsiveness Debug')

  // Device detection info
  const isMobile = isMobileDevice()
  const userAgent = globalThis.navigator?.userAgent || 'Unknown'
  const screenWidth = globalThis.innerWidth
  const screenHeight = globalThis.innerHeight
  const screenAspect = screenWidth / screenHeight
  const isPortrait = screenHeight > screenWidth
  const devicePixelRatio = globalThis.devicePixelRatio || 1

  log.debug(lc.GL, '📱 Device Detection:', {
    isMobile,
    isPortrait,
    userAgent: userAgent.substring(0, 100) + '...',
    touchSupport: 'ontouchstart' in globalThis,
    maxTouchPoints: globalThis.navigator?.maxTouchPoints || 0,
  })

  log.debug(lc.GL, '📐 Screen Info:', {
    width: screenWidth,
    height: screenHeight,
    aspect: screenAspect.toFixed(2),
    devicePixelRatio,
    orientation: isPortrait ? 'Portrait' : 'Landscape',
  })

  // Responsive dimensions
  const responsive = getBaselineDimensions()
  log.debug(lc.GL, '🎯 Responsive Dimensions:', {
    planeWidth: responsive.planeWidth.toFixed(2),
    planeHeight: responsive.planeHeight.toFixed(2),
    cameraZ: responsive.cameraZ.toFixed(2),
    fov: responsive.fov,
    scale: responsive.scale,
  })

  // Calculate visible area at this camera distance for verification
  const fovRad = (responsive.fov * Math.PI) / 180
  const visibleHeight = 2 * Math.tan(fovRad / 2) * responsive.cameraZ
  const visibleWidth = visibleHeight * screenAspect

  log.debug(lc.GL, '📏 Visible Area Check:', {
    visibleWidth: visibleWidth.toFixed(2),
    visibleHeight: visibleHeight.toFixed(2),
    logoFitsWidth: visibleWidth > responsive.planeWidth * 1.1,
    logoFitsHeight: visibleHeight > responsive.planeHeight * 1.1,
    widthPadding: ((visibleWidth - responsive.planeWidth) / responsive.planeWidth * 100).toFixed(1) + '%',
    heightPadding: ((visibleHeight - responsive.planeHeight) / responsive.planeHeight * 100).toFixed(1) + '%',
  })

  // Visibility recommendations
  const recommendations = []
  if (isMobile && responsive.scale < 0.9) {
    recommendations.push('⚠️ Scale might be too small for mobile visibility')
  }
  if (responsive.cameraZ > 6) {
    recommendations.push('⚠️ Camera might be too far back')
  }
  if (responsive.planeWidth < 6) {
    recommendations.push('⚠️ Logo plane might be too small')
  }

  if (recommendations.length > 0) {
    log.warn(lc.GL, '🚨 Potential Issues:', recommendations)
  } else {
    log.debug(lc.GL, '✅ Configuration looks good')
  }

  console.groupEnd()
}

/**
 * Continuously monitors and logs responsive changes
 *
 * Sets up automatic logging of responsive dimension changes
 * when the window is resized or orientation changes.
 */
export const startMobileDebugMonitoring = (): () => void => {
  log.debug(lc.GL, '🔄 Starting mobile responsiveness monitoring...')

  debugMobileResponsiveness()

  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      log.debug(lc.GL, '📱 Window resized, checking responsiveness...')
      debugMobileResponsiveness()
    }, 250)
  }

  globalThis.addEventListener('resize', handleResize)
  globalThis.addEventListener('orientationchange', handleResize)

  return () => {
    globalThis.removeEventListener('resize', handleResize)
    globalThis.removeEventListener('orientationchange', handleResize)
    if (resizeTimeout) clearTimeout(resizeTimeout)
    log.debug(lc.GL, '🛑 Stopped mobile responsiveness monitoring')
  }
}
