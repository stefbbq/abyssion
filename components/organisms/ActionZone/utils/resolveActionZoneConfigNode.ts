/**
 * Recursively resolves the most specific config node for a given route, key, and selector path.
 * Looks up in order: exact route, route-pair, selector, key, '*', '/*', and falls back to parent/default.
 */
import type { ActionZoneConfigNode, ActionZoneConfigRoot } from '../configurations/types.ts'

export const resolveActionZoneConfigNode = (
  config: ActionZoneConfigRoot,
  route: string,
  keyPath: string[],
): ActionZoneConfigNode | undefined => {
  let node = config[route] || config['/*'] || config['*']
  if (!node) return undefined
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
