/**
 * Route to Layout mapping utility
 * Determines which ActionZone layout should be used for each route
 */

import pagesConfig from '@data/pages.json' with { type: 'json' }
import type { PagesConfig } from '@data/types.ts'
import { lc, log } from '@lib/logger/index.ts'

export type LayoutType = 'collapsed' | 'collapsedPage' | 'expanded'

/**
 * Get the layout type for a given route
 * Reads from pages.json configuration to determine the appropriate layout
 */
export const getLayoutForRoute = (route: string, isMenuOpen: boolean = false): LayoutType => {
  if (isMenuOpen) return 'expanded'

  const pageConfig = (pagesConfig as PagesConfig)[route]

  // If page has explicit layout configuration, use it
  if (pageConfig?.actionZoneLayout) {
    return pageConfig.actionZoneLayout
  }

  // Default behavior: home page uses 'collapsed', all other pages use 'collapsedPage'
  return route === '/' ? 'collapsed' : 'collapsedPage'
}

/**
 * Get all routes that use a specific layout
 * Reads from pages.json configuration
 */
export const getRoutesForLayout = (layoutType: LayoutType): string[] => {
  return Object.entries(pagesConfig as PagesConfig)
    .filter(([route, config]) => {
      // Check explicit layout configuration
      if (config?.actionZoneLayout) {
        return config.actionZoneLayout === layoutType
      }
      // Apply default logic
      const defaultLayout = route === '/' ? 'collapsed' : 'collapsedPage'
      return defaultLayout === layoutType
    })
    .map(([route, _]) => route)
}

/**
 * Generate route-to-route transition key
 */
export const getRouteTransition = (fromRoute: string, toRoute: string): string => {
  return `${fromRoute}->${toRoute}`
}

/**
 * Check if a route transition requires a layout change
 */
export const requiresLayoutChange = (fromRoute: string, toRoute: string, isMenuOpen: boolean = false): boolean => {
  const fromLayout = getLayoutForRoute(fromRoute, isMenuOpen)
  const toLayout = getLayoutForRoute(toRoute, isMenuOpen)
  return fromLayout !== toLayout
}

/**
 * Get all possible route transitions for a given layout
 * This helps when defining transitions in config files
 */
export const getRouteTransitionsForLayout = (layoutType: LayoutType): string[] => {
  const routesForThisLayout = getRoutesForLayout(layoutType)
  const allRoutes = Object.keys(pagesConfig as PagesConfig)

  const transitions: string[] = []

  // Generate all possible transitions FROM this layout's routes TO other routes
  for (const fromRoute of routesForThisLayout) {
    for (const toRoute of allRoutes) {
      if (fromRoute !== toRoute && requiresLayoutChange(fromRoute, toRoute)) {
        transitions.push(getRouteTransition(fromRoute, toRoute))
      }
    }
  }

  return transitions
}

/**
 * Debug helper: log all route mappings
 */
export const debugRouteLayoutMappings = () => {
  log.debug(lc.ACTION_ZONE, '🗺️ Route → Layout Mappings')
  Object.entries(pagesConfig as PagesConfig).forEach(([route, config]) => {
    const layout = config?.actionZoneLayout || (route === '/' ? 'collapsed' : 'collapsedPage')
    log.debug(lc.ACTION_ZONE, `  ${route} → ${layout}`)
  })

  log.debug(lc.ACTION_ZONE, '📋 Layout → Routes Mappings')
  const layouts: LayoutType[] = ['collapsed', 'collapsedPage', 'expanded']
  layouts.forEach((layout) => {
    const routes = getRoutesForLayout(layout)
    log.debug(lc.ACTION_ZONE, `  ${layout}: [${routes.join(', ')}]`)
  })

  log.debug(lc.ACTION_ZONE, '🔄 Route Transitions by Layout')
  layouts.forEach((layout) => {
    const transitions = getRouteTransitionsForLayout(layout)
    log.debug(lc.ACTION_ZONE, `  ${layout} needs transitions for:`, transitions)
  })
}
