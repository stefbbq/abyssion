import {
  collapsedBorderRadius,
  collapsedHeight,
  containerTransitionDuration,
  easeInOutEasing,
  easeOutEasing,
  expandedBorderRadius,
  expandedHeight,
  fastTransitionDuration,
  staggerDelay,
} from '../constants.ts'

/**
 * Layout-to-layout transition configurations
 * Defines how the ActionZone morphs between different layout states
 * Updated with improved timing and staggered animations
 */
export const layoutTransitions = {
  // Menu opening: collapsed → expanded
  'collapsed->expanded': {
    container: {
      animate: {
        height: expandedHeight,
        borderRadius: expandedBorderRadius,
      },
      transition: {
        duration: containerTransitionDuration,
        ease: easeInOutEasing,
        layout: { duration: containerTransitionDuration },
      },
    },
    children: {
      // Shows/contact buttons fade out quickly
      shows: {
        exit: { opacity: 0, x: -20, scale: 0.95 },
        transition: { duration: fastTransitionDuration * 0.75, ease: easeOutEasing },
      },
      contact: {
        exit: { opacity: 0, x: 20, scale: 0.95 },
        transition: { duration: fastTransitionDuration * 0.75, ease: easeOutEasing },
      },
      // Menu button stays visible with subtle scale
      menu: {
        animate: { scale: 1.05 },
        transition: { duration: fastTransitionDuration, ease: easeOutEasing },
      },
      // Social links enter with delay
      socialLinks: {
        initial: { opacity: 0, y: -15 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.25,
          delay: containerTransitionDuration * 0.3,
          ease: easeOutEasing,
        },
      },
    },
  },

  // Menu closing: expanded → collapsed
  'expanded->collapsed': {
    container: {
      animate: {
        height: collapsedHeight,
        borderRadius: collapsedBorderRadius,
      },
      transition: {
        duration: containerTransitionDuration,
        ease: easeInOutEasing,
        layout: { duration: containerTransitionDuration },
      },
    },
    children: {
      // Social links and menu items exit with stagger
      socialLinks: {
        exit: { opacity: 0, y: -20 },
        transition: { duration: fastTransitionDuration, ease: easeOutEasing },
      },
      shows: {
        exit: { opacity: 0, y: -10, scale: 0.95 },
        transition: { duration: fastTransitionDuration, delay: staggerDelay, ease: easeOutEasing },
      },
      contact: {
        exit: { opacity: 0, y: -10, scale: 0.95 },
        transition: { duration: fastTransitionDuration, delay: staggerDelay * 1.5, ease: easeOutEasing },
      },
      about: {
        exit: { opacity: 0, y: -10, scale: 0.95 },
        transition: { duration: fastTransitionDuration, delay: staggerDelay * 2, ease: easeOutEasing },
      },
      // Navigation buttons enter with delay and stagger
      showsNav: {
        initial: { opacity: 0, x: -20, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 },
        transition: {
          duration: fastTransitionDuration,
          delay: containerTransitionDuration * 0.6,
          ease: easeOutEasing,
        },
      },
      contactNav: {
        initial: { opacity: 0, x: 20, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 },
        transition: {
          duration: fastTransitionDuration,
          delay: containerTransitionDuration * 0.6 + staggerDelay,
          ease: easeOutEasing,
        },
      },
      // Menu button back to normal
      menu: {
        animate: { scale: 1 },
        transition: { duration: fastTransitionDuration, ease: easeOutEasing },
      },
    },
  },

  // Route change from home: collapsed → collapsedPage
  'collapsed->collapsedPage': {
    container: {
      animate: {
        height: collapsedHeight, // Same height
        borderRadius: collapsedBorderRadius,
      },
      transition: {
        duration: fastTransitionDuration,
        ease: easeInOutEasing,
        layout: { duration: fastTransitionDuration },
      },
    },
    children: {
      // Shows/contact buttons morph to back/title
      shows: {
        exit: { opacity: 0, x: -20, scale: 0.95 },
        transition: { duration: fastTransitionDuration * 0.75, ease: easeOutEasing },
      },
      contact: {
        exit: { opacity: 0, x: 20, scale: 0.95 },
        transition: { duration: fastTransitionDuration * 0.75, ease: easeOutEasing },
      },
      // Back button enters with slight delay
      back: {
        initial: { opacity: 0, x: -20, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 },
        transition: {
          duration: fastTransitionDuration,
          delay: fastTransitionDuration * 0.3,
          ease: easeOutEasing,
        },
      },
      // Title enters with stagger
      title: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: fastTransitionDuration,
          delay: fastTransitionDuration * 0.5,
          ease: easeOutEasing,
        },
      },
      // Menu button morphs via layoutId
      menu: {
        animate: { scale: 1 },
        transition: { duration: fastTransitionDuration, ease: easeOutEasing },
      },
    },
  },

  // Route change to home: collapsedPage → collapsed
  'collapsedPage->collapsed': {
    container: {
      animate: {
        height: collapsedHeight,
        borderRadius: collapsedBorderRadius,
      },
      transition: {
        duration: fastTransitionDuration,
        ease: easeInOutEasing,
        layout: { duration: fastTransitionDuration },
      },
    },
    children: {
      // Back/title buttons exit quickly
      back: {
        exit: { opacity: 0, x: -20, scale: 0.95 },
        transition: { duration: fastTransitionDuration * 0.75, ease: easeOutEasing },
      },
      title: {
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: fastTransitionDuration * 0.75, ease: easeOutEasing },
      },
      // Shows/contact buttons enter with stagger
      shows: {
        initial: { opacity: 0, x: -20, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 },
        transition: {
          duration: fastTransitionDuration,
          delay: fastTransitionDuration * 0.4,
          ease: easeOutEasing,
        },
      },
      contact: {
        initial: { opacity: 0, x: 20, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 },
        transition: {
          duration: fastTransitionDuration,
          delay: fastTransitionDuration * 0.4 + staggerDelay,
          ease: easeOutEasing,
        },
      },
    },
  },

  // Menu opening on page: collapsedPage → expanded
  'collapsedPage->expanded': {
    container: {
      animate: {
        height: expandedHeight,
        borderRadius: expandedBorderRadius,
      },
      transition: {
        duration: containerTransitionDuration,
        ease: easeInOutEasing,
        layout: { duration: containerTransitionDuration },
      },
    },
    children: {
      // Back/title buttons fade out
      back: {
        exit: { opacity: 0, x: -20, scale: 0.95 },
        transition: { duration: fastTransitionDuration * 0.75, ease: easeOutEasing },
      },
      title: {
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: fastTransitionDuration * 0.75, ease: easeOutEasing },
      },
      // Menu button scales
      menu: {
        animate: { scale: 1.05 },
        transition: { duration: fastTransitionDuration, ease: easeOutEasing },
      },
      // Social links enter with delay
      socialLinks: {
        initial: { opacity: 0, y: -15 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.25,
          delay: containerTransitionDuration * 0.3,
          ease: easeOutEasing,
        },
      },
    },
  },

  // Menu closing on page: expanded → collapsedPage
  'expanded->collapsedPage': {
    container: {
      animate: {
        height: collapsedHeight,
        borderRadius: collapsedBorderRadius,
      },
      transition: {
        duration: containerTransitionDuration,
        ease: easeInOutEasing,
        layout: { duration: containerTransitionDuration },
      },
    },
    children: {
      // Social links and menu buttons exit with stagger
      socialLinks: {
        exit: { opacity: 0, y: -20 },
        transition: { duration: fastTransitionDuration, ease: easeOutEasing },
      },
      shows: {
        exit: { opacity: 0, y: -10, scale: 0.95 },
        transition: { duration: fastTransitionDuration, delay: staggerDelay, ease: easeOutEasing },
      },
      contact: {
        exit: { opacity: 0, y: -10, scale: 0.95 },
        transition: { duration: fastTransitionDuration, delay: staggerDelay * 1.5, ease: easeOutEasing },
      },
      about: {
        exit: { opacity: 0, y: -10, scale: 0.95 },
        transition: { duration: fastTransitionDuration, delay: staggerDelay * 2, ease: easeOutEasing },
      },
      // Back/title buttons fade in with delay
      back: {
        initial: { opacity: 0, x: -20, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 },
        transition: {
          duration: fastTransitionDuration,
          delay: containerTransitionDuration * 0.6,
          ease: easeOutEasing,
        },
      },
      title: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: fastTransitionDuration,
          delay: containerTransitionDuration * 0.6 + staggerDelay,
          ease: easeOutEasing,
        },
      },
      // Menu button back to normal
      menu: {
        animate: { scale: 1 },
        transition: { duration: fastTransitionDuration, ease: easeOutEasing },
      },
    },
  },
}

export type LayoutTransitionKey = keyof typeof layoutTransitions
