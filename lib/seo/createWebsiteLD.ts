import type { WebSiteLD } from '@lib/seo/ld.types.ts'

/** creates a WebSite JSON-LD object */
export const createWebsiteLD = (siteName: string, origin: string): WebSiteLD => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: origin,
})
