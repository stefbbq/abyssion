/** json-ld type definitions used across the app */

/** schema.org WebSite entity for the site container */
export type WebSiteLD = {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  /** human-readable site name */
  name: string
  /** canonical site url (origin) */
  url: string
}

/** schema.org MusicGroup entity describing the band */
export type MusicGroupLD = {
  '@context'?: 'https://schema.org'
  '@type': 'MusicGroup'
  /** the group's display name */
  name: string
  /** canonical url to the group's homepage */
  url?: string
  /** brand logo url */
  logo?: string
  /** representative image url */
  image?: string
  /** social profile urls (facebook, instagram, etc.) */
  sameAs?: string[]
  /** public contact email */
  email?: string
  /** short bio/description of the artist */
  description?: string
  /** primary genres for the artist */
  genre?: string | string[]
  /** band members as Person entities */
  member?: Array<PersonLD>
  /** optional location, either a PostalAddress or a freeform string */
  address?: PostalAddressLD | string
}

/** schema.org MusicEvent entity for a performance/show */
export type MusicEventLD = {
  '@context'?: 'https://schema.org'
  '@type': 'MusicEvent'
  /** event display name, typically venue + locality */
  name: string
  /** iso date string, e.g. 2025-07-11 */
  startDate: string
  /** event status iri (e.g., https://schema.org/EventScheduled) */
  eventStatus?: string
  location: {
    '@type': 'Place'
    /** venue name */
    name: string
    /** human readable address or city/region */
    address: string
  }
  /** ticket or details url */
  url?: string
  performer?: {
    '@type': 'MusicGroup'
    /** performer name */
    name: string
    /** homepage url for the performer */
    url?: string
  }
}

/** schema.org ListItem wrapper with position information */
export type ListItemLD<T> = {
  '@type': 'ListItem'
  position: number
  item: T
}

/** schema.org ItemList container for ordered lists */
export type ItemListLD<T> = {
  '@context': 'https://schema.org'
  '@type': 'ItemList'
  itemListElement: Array<ListItemLD<T>>
}

export type MusicEventListLD = ItemListLD<MusicEventLD>

/** schema.org Person entity used for band members */
export type PersonLD = {
  '@context'?: 'https://schema.org'
  '@type': 'Person'
  /** full name */
  name: string
  /** profile image url */
  image?: string
  /** short member bio */
  description?: string
  /** social profile urls */
  sameAs?: string[]
}

/** schema.org MusicRecording entity for individual tracks */
export type MusicRecordingLD = {
  '@context'?: 'https://schema.org'
  '@type': 'MusicRecording'
  /** track title */
  name: string
  /** canonical or streaming url */
  url?: string
  /** album association */
  inAlbum?: MusicAlbumLD
  /** performing artist */
  byArtist?: MusicGroupLD
}

/** schema.org MusicAlbum entity for releases */
export type MusicAlbumLD = {
  '@context'?: 'https://schema.org'
  '@type': 'MusicAlbum'
  /** album title */
  name: string
  /** album artist reference */
  byArtist?: MusicGroupLD
  /** publication year or date */
  datePublished?: string
  /** number of tracks on the release */
  numTracks?: number
  /** production type (e.g., StudioAlbum, LiveAlbum) */
  albumProductionType?: string
  /** release type (e.g., Album, EP, Single) */
  albumReleaseType?: string
}

export type MusicAlbumListLD = ItemListLD<MusicAlbumLD>

/** schema.org PostalAddress entity for structured addresses */
export type PostalAddressLD = {
  '@context'?: 'https://schema.org'
  '@type': 'PostalAddress'
  /** city or locality */
  addressLocality?: string
  /** state, province, or region */
  addressRegion?: string
  /** country name */
  addressCountry?: string
  /** optional street address */
  streetAddress?: string
  /** postal or zip code */
  postalCode?: string
}
