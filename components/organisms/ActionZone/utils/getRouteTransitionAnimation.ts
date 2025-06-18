/**
 * Resolves the most specific animation variant for a route transition.
 * Falls back to default keys or defaultAnimationVariant as needed.
 */
export const getRouteTransitionAnimation = (
  from: string,
  to: string,
  config: Record<string, any>,
): Record<string, any> => {
  const transitions = config.transitions || {}
  if (transitions[from] && transitions[from][to]) return transitions[from][to]
  if (transitions[from] && transitions[from].default) return transitions[from].default
  if (transitions.default && transitions.default[to]) return transitions.default[to]
  if (config.defaultAnimationVariant) return config.defaultAnimationVariant
  return { initial: {}, animate: {} }
}
