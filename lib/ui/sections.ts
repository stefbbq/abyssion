import navData from '@data/nav.json' with { type: 'json' }

/** unified list of in-page section ids, derived from nav config */
type NavItem = { key: string; label: string; path: string }
const asNav = (data: unknown): { mainNav?: NavItem[] } => data as { mainNav?: NavItem[] }
export const sectionIds: string[] = Array.isArray(asNav(navData).mainNav)
  ? (asNav(navData).mainNav as NavItem[])
    .map((item) => typeof item.path === 'string' && item.path.startsWith('#') ? item.path.replace('#', '') : null)
    .filter((id): id is string => Boolean(id))
  : ['home', 'bio', 'shows', 'contact']

/** shared scroll offset for smooth scrolling behavior */
export const getScrollOffset = () => globalThis.innerWidth < 768 ? 20 : 75
