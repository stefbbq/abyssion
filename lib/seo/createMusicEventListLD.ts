import type { ContentShowsEntry } from '@data/types.ts'
import type { MusicEventListLD } from '@lib/seo/ld.types.ts'

/**
 * creates a MusicEvent ItemList JSON-LD from content show entries
 */
export const createMusicEventListLD = (
  shows: ContentShowsEntry[],
  options: { canonicalUrl: string; siteOrigin: string },
): MusicEventListLD | null => {
  if (!Array.isArray(shows) || shows.length === 0) return null

  const upcoming = shows.filter((s) => {
    const d = new Date(s.date)
    const today = new Date()
    d.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return d >= today
  })

  if (upcoming.length === 0) return null

  const { canonicalUrl, siteOrigin } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: upcoming.map((show, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'MusicEvent',
        name: `${show.venue} — ${show.location}`,
        startDate: show.date,
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'Place',
          name: show.venue,
          address: show.location,
        },
        url: show.ticketLink || canonicalUrl,
        performer: {
          '@type': 'MusicGroup',
          name: 'Abyssion',
          url: siteOrigin,
        },
      },
    })),
  }
}
