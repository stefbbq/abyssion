/**
 * matchRouteConfig
 * Given a config object, a state key, and a route, returns the best-matching config for that state and route.
 * Falls back to 'default' if no specific match is found.
 * Uses prefix matching (e.g. '/shows' matches '/shows', '/shows/123', etc).
 *
 * @param config The full config object (e.g. from nav-actionZone-animation.ts)
 * @param state The state key (e.g. 'collapsedDefault', 'collapsedBack', 'expandedMenu')
 * @param route The current route (e.g. '/shows', '/shows/123')
 * @returns The config object for the best-matching route, or the 'default' config for that state
 */
export const matchRouteConfig = (
  config: RouteConfig,
  state: string,
  route: string,
): unknown => {
  const stateConfig = config[state]
  if (!stateConfig) return undefined

  // Try to find the most specific matching route key
  const routeKeys = Object.keys(stateConfig).filter((k) => k !== 'default')
  // Sort by length descending for most specific match
  routeKeys.sort((a, b) => b.length - a.length)
  const match = routeKeys.find((key) => route.startsWith(key))
  if (match) return stateConfig[match]
  return stateConfig['default']
}
