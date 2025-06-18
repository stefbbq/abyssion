/**
 * Resolves the most specific animation variant for a child (button, title, etc.) for a route transition.
 */
export const getChildTransitionAnimation = (
  childKey: string,
  from: string,
  to: string,
  config: Record<string, any>,
): Record<string, any> | undefined => {
  const childMap = config.childTransitions?.[childKey]
  if (!childMap) return undefined
  if (childMap[from] && childMap[from][to]) return childMap[from][to]
  if (childMap[from] && childMap[from].default) return childMap[from].default
  if (childMap.default && childMap.default[to]) return childMap.default[to]
  return undefined
}
