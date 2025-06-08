/**
 * Configuration for a single page, controlling UI elements and access.
 */
export type PageConfig = {
  /** If true, the page is only accessible in debug mode. */
  debugOnly?: boolean
  /** If false, the main site header will be hidden on this page. */
  showHeader?: boolean
  /** If false, the mobile action zone will be hidden on this page. */
  showActionZone?: boolean
}

/**
 * A record mapping page routes to their specific configurations.
 */
export type PagesConfig = Record<string, PageConfig>

/**
 * Defines the state and behavior of a navigation button in the Action Zone.
 * Used by framer-motion to animate the navigation buttons.
 */
export type NavButtonState = {
  id: string
  key: string
  role: 'page-title' | 'nav-item' | 'action-button' | 'back-button'
  content: {
    label: string
    icon?: 'back' | 'menu'
  }
  position: 'left' | 'center' | 'right'
  action: {
    type: 'navigate' | 'menu' | 'back' | 'none'
    href?: string
  }
  isActive?: boolean
}

/**
 * Represents a single item in a navigation menu.
 */
export type MenuItem = {
  key: string
  path: string
  label: string
  excludeFrom?: string[]
}

/**
 * Represents a link to a social media profile.
 */
export type SocialLink = {
  key: string
  url: string
  label: string
}

/**
 * Represents a single show or concert, upcoming or past.
 */
export type Show = {
  id: string
  title: string
  date: string
  venue: string
  location: string
  ticketLink: string
  isPast: boolean
}

/**
 * Represents a member of the band.
 */
export type BandMember = {
  id: string
  name: string
  role: string
  bio: string
  image: string
}

/**
 * Represents a music album or release.
 */
export type Album = {
  year: string
  title: string
  type: string
  tracks: number
}

/**
 * Defines the titles and descriptions for sections on the biography page.
 */
export type BioSection = {
  mainTitle: string
  mainDescription: string
  aboutTitle: string
  membersTitle: string
  albumsTitle: string
}
