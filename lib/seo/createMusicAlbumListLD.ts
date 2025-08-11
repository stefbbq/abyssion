import type { BioAlbumEntry } from '@data/types.ts'
import type { MusicAlbumListLD } from '@lib/seo/ld.types.ts'

/**
 * creates a MusicAlbum ItemList JSON-LD from bio album entries
 */
export const createMusicAlbumListLD = (
  albums: BioAlbumEntry[],
  options: { artistName: string; siteOrigin?: string },
): MusicAlbumListLD | null => {
  if (!Array.isArray(albums) || albums.length === 0) return null

  const { artistName } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: albums.map((album, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'MusicAlbum',
        name: album.title || 'untitled release',
        byArtist: {
          '@type': 'MusicGroup',
          name: artistName,
        },
        datePublished: album.year,
        numTracks: album.tracks,
      },
    })),
  }
}
