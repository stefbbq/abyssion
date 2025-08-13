import type { BandMember, ContentShowsEntry, SiteNav } from '@data/types.ts'
import type { PersonLD } from './ld.types.ts'

/**
 * the cleaned meta description from bio.about
 *
 * @returns the cleaned description
 */
export const getCleanDescription = (about: unknown, maxLen: number = 160): string => {
  if (typeof about !== 'string') return ''
  return about.replace(/\s+/g, ' ').slice(0, maxLen).trim()
}

/**
 * extract sameAs urls from nav.json
 *
 * @returns the sameAs urls
 */
export const getSameAs = (nav: SiteNav | unknown): string[] => {
  const n = nav as SiteNav
  return Array.isArray(n?.socialLinks) ? n.socialLinks.map((s) => s.url).filter(Boolean) : []
}

/**
 * map bio members to Person LD entries

* @returns the mapped members
 */
export const mapMembersToPersons = (
  members: BandMember[] | unknown,
): PersonLD[] => {
  if (!Array.isArray(members)) return []
  return (members as BandMember[]).map((m) => ({
    '@type': 'Person',
    name: m.name,
    image: m.image,
    description: m.bio,
  }))
}

/**
 * filter shows to upcoming (>= today at midnight)
 *
 * @returns upcoming shows
 */
export const getUpcomingShows = (
  shows: ContentShowsEntry[] | unknown,
  referenceDate: Date = new Date(),
): ContentShowsEntry[] => {
  if (!Array.isArray(shows)) return []
  const today = new Date(referenceDate)
  today.setHours(0, 0, 0, 0)
  return (shows as ContentShowsEntry[]).filter((s) => {
    const d = new Date(s.date)
    d.setHours(0, 0, 0, 0)
    return d >= today
  })
}

/**
 * derive core seo meta values from url + data config
 *
 * @returns seo meta values
 */
export const getSeoMeta = (
  url: URL,
  seoConfig: { siteName: string; ogTitle: string; logoPath: string; ogImagePath: string },
  description: string,
): {
  origin: string
  canonicalUrl: string
  siteName: string
  ogTitle: string
  logoUrl: string
  imageUrl: string
  description: string
} => {
  const origin = url.origin
  const canonicalUrl = url.href
  const siteName = seoConfig.siteName
  const ogTitle = seoConfig.ogTitle
  const logoUrl = `${origin}${seoConfig.logoPath}`
  const imageUrl = `${origin}${seoConfig.ogImagePath}`

  return { origin, canonicalUrl, siteName, ogTitle, logoUrl, imageUrl, description }
}
