import navData from '@data/nav.json' with { type: 'json' }
import type { NavItem } from '@data/types.ts'

const asNav = (data: unknown): { mainNav?: NavItem[] } => data as { mainNav?: NavItem[] }

/**
 * Unified list of in-page section ids, derived from nav config
 *
 * @returns unified list of in-page section ids, derived from nav config
 */
export const getSectionIDs = (): string[] => {
  // fallback to hardcoded default section ids if nav config is invalid
  if (!Array.isArray(asNav(navData).mainNav)) return ['home', 'bio', 'shows', 'contact']

  // extract section ids from nav config
  return (asNav(navData).mainNav as NavItem[])
    .map((item) => typeof item.path === 'string' && item.path.startsWith('#') ? item.path.replace('#', '') : null) // remove # from path
    .filter((id): id is string => Boolean(id)) // filter out null values
}
