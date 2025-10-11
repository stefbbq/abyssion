import { getScrollOffset } from './getScrollOffest.ts'

/**
 * smooth scroll to a section by id
 */
export const smoothScrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (!element) return false

  const offsetTop = element.offsetTop - getScrollOffset()
  globalThis.scrollTo({ top: offsetTop, behavior: 'smooth' })
  return true
}
