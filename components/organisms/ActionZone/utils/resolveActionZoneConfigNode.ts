/**
 * Recursively resolves the most specific config node for a given route, key, and selector path.
 * Looks up in order: exact route, route-pair, selector, key, '*', '/*', and falls back to parent/default.
 */
import type { ActionZoneConfigNode, ActionZoneConfigRoot } from '../configurations/types.ts'
import { lc, log } from '@lib/logger/index.ts'

export const resolveActionZoneConfigNode = (
  config: ActionZoneConfigRoot,
  route: string,
  keyPath: string[],
): ActionZoneConfigNode | undefined => {
  const routeConfig = config[route]
  const wildcardConfig = config['/*']
  const fallbackConfig = config['*']
  const nodeValue = routeConfig || wildcardConfig || fallbackConfig

  log.debug(lc.ACTION_ZONE, 'Config node resolution', {
    route,
    hasRouteConfig: !!routeConfig,
    hasWildcardConfig: !!wildcardConfig,
    hasFallbackConfig: !!fallbackConfig,
    selectedConfig: routeConfig ? 'route' : wildcardConfig ? 'wildcard' : fallbackConfig ? 'fallback' : 'none',
    configKeys: Object.keys(config),
    keyPath,
  })

  // Handle string values in config
  if (typeof nodeValue === 'string') {
    log.debug(lc.ACTION_ZONE, 'String value found in config:', nodeValue)
    return undefined
  }

  const node = nodeValue as ActionZoneConfigNode
  if (!node) {
    log.debug(lc.ACTION_ZONE, 'No config node found')
    return undefined
  }

  log.debug(lc.ACTION_ZONE, 'Config node resolved', {
    type: node.type,
    hasChildren: !!node.children,
    childrenKeys: node.children ? Object.keys(node.children) : null,
    layout: node.layout,
  })

  if (!keyPath.length) return node

  const [currentKey, ...rest] = keyPath
  const child = node.children?.[currentKey]
  if (child) return resolveActionZoneConfigNode({ root: child }, 'root', rest)

  // fallback to selector keys
  if (node.children?.['.' + currentKey]) return resolveActionZoneConfigNode({ root: node.children['.' + currentKey] }, 'root', rest)
  if (node.children?.['#' + currentKey]) return resolveActionZoneConfigNode({ root: node.children['#' + currentKey] }, 'root', rest)
  if (node.children?.['*']) return resolveActionZoneConfigNode({ root: node.children['*'] }, 'root', rest)
  return node
}
