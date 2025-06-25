// Dimensions
export const expandedHeight = 300
export const collapsedHeight = 80
export const expandedBorderRadius = 24
export const collapsedBorderRadius = 40

// Easing presets
export const springEasing = [0.22, 1, 0.36, 1]
export const easeInOutEasing = [0.4, 0, 0.2, 1]
export const easeOutEasing = [0, 0, 0.2, 1]
export const easeInEasing = [0.4, 0, 1, 1]

// Timing constants
export const staggerDelay = 0.08 // Delay between staggered animations
export const containerTransitionDuration = 0.35 // Main container transitions
export const fastTransitionDuration = 0.2 // Quick element transitions
export const slowTransitionDuration = 0.4 // Slower, more deliberate transitions

// Animation presets
export const fadeInOutAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: fastTransitionDuration, ease: easeInOutEasing },
}

// Default animation for elements without explicit animations
export const defaultElementAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: fastTransitionDuration, ease: easeInOutEasing },
}

// Staggered menu animation variants
export const staggeredMenuAnimation = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
  transition: { duration: fastTransitionDuration, ease: easeOutEasing },
}

// Container variants for staggered children
export const staggeredContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: staggerDelay * 0.5,
      staggerDirection: -1,
    },
  },
}

// Social links specific animation (faster)
export const socialLinksAnimation = {
  initial: { opacity: 0, y: -15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.25, ease: easeOutEasing },
}

// Responsive breakpoints and dimensions
export const responsiveBreakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
}

// Responsive dimension calculations
export const getResponsiveDimensions = (screenWidth: number) => {
  const isMobile = screenWidth < responsiveBreakpoints.tablet
  const isTablet = screenWidth >= responsiveBreakpoints.tablet && screenWidth < responsiveBreakpoints.desktop

  return {
    expandedHeight: isMobile ? 280 : expandedHeight,
    collapsedHeight: isMobile ? 70 : collapsedHeight,
    expandedBorderRadius: isMobile ? 20 : expandedBorderRadius,
    collapsedBorderRadius: isMobile ? 35 : collapsedBorderRadius,
    containerTransitionDuration: isMobile ? containerTransitionDuration * 0.8 : containerTransitionDuration,
    fastTransitionDuration: isMobile ? fastTransitionDuration * 0.8 : fastTransitionDuration,
    staggerDelay: isMobile ? staggerDelay * 0.7 : staggerDelay,
  }
}

// Performance-optimized animation presets for different devices
export const getDeviceOptimizedAnimation = (isMobile: boolean = false) => ({
  // Reduced motion for mobile devices
  staggeredMenuAnimation: {
    initial: { opacity: 0, y: isMobile ? 15 : 20, scale: isMobile ? 0.98 : 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: isMobile ? -8 : -10, scale: isMobile ? 0.98 : 0.95 },
    transition: {
      duration: isMobile ? fastTransitionDuration * 0.8 : fastTransitionDuration,
      ease: easeOutEasing,
    },
  },

  socialLinksAnimation: {
    initial: { opacity: 0, y: isMobile ? -10 : -15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: isMobile ? -10 : -15 },
    transition: {
      duration: isMobile ? 0.2 : 0.25,
      ease: easeOutEasing,
    },
  },

  // Container variants with device-specific timing
  staggeredContainerVariants: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: isMobile ? staggerDelay * 0.7 : staggerDelay,
        delayChildren: isMobile ? 0.05 : 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: isMobile ? staggerDelay * 0.35 : staggerDelay * 0.5,
        staggerDirection: -1,
      },
    },
  },
})
