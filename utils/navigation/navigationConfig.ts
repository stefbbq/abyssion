/**
 * Navigation configuration constants
 * Defines menu items, social links, and navigation structure
 */

export const NAV_CONFIG = {
  homepage: {
    items: [
      { key: 'shows', label: 'Shows', path: '/shows' },
      { key: 'contact', label: 'Contact', path: '/contact' },
    ],
  },
  expandedMenu: {
    items: [
      { key: 'home', label: 'Home', path: '/' },
      { key: 'shows', label: 'Shows', path: '/shows' },
      { key: 'bio', label: 'Bio', path: '/bio' },
      { key: 'newsletter', label: 'Newsletter', path: '#newsletter' },
      { key: 'contact', label: 'Contact', path: '/contact' },
      { key: 'listen', label: 'Listen', path: '#listen' },
    ],
  },
  socialLinks: [
    { key: 'facebook', url: 'https://facebook.com', icon: 'FacebookIcon' },
    { key: 'instagram', url: 'https://instagram.com', icon: 'InstagramIcon' },
    { key: 'discord', url: 'https://discord.gg', icon: 'DiscordIcon' },
    { key: 'soundcloud', url: 'https://soundcloud.com', icon: 'SoundCloudIcon' },
  ],
}

export type MenuItem = {
  key: string
  label: string
  path: string
}

export type SocialLink = {
  key: string
  url: string
  icon: string
}
