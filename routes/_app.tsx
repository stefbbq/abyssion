import { type PageProps } from '$fresh/server.ts'
import { Head, Partial } from '$fresh/runtime.ts'

import type { ContentContact, ContentShowsEntry, PagesConfig, SiteNav } from '@data/types.ts'
import type { MusicAlbumListLD, MusicEventListLD, MusicGroupLD, PersonLD, WebSiteLD } from '@lib/seo/ld.types.ts'
import Header from '@islands/Header.tsx'
import ActionZoneController from '@islands/ActionZoneController.tsx'
import { DebugPanels } from '@islands/DebugPanels.tsx'
import pagesConfig from '@data/pages.json' with { type: 'json' }
import ThemeProvider from '@islands/ThemeProvider.tsx'
import { currentUITheme } from '@lib/theme/index.ts'
import SinglePageScrollManager from '@islands/SinglePageScrollManager.tsx'
import { createWebsiteLD } from '@lib/seo/createWebsiteLD.ts'
import { createMusicGroupLD } from '@lib/seo/createMusicGroupLD.ts'
import { createMusicAlbumListLD } from '@lib/seo/createMusicAlbumListLD.ts'
import { createMusicEventListLD } from '@lib/seo/createMusicEventListLD.ts'
import bio from '@data/content-bio.json' with { type: 'json' }
import shows from '@data/content-shows.json' with { type: 'json' }
import nav from '@data/nav.json' with { type: 'json' }
import contact from '@data/content-contact.json' with { type: 'json' }

export default function App({ Component, url }: PageProps) {
  const pagePath = url.pathname
  const config = (pagesConfig as PagesConfig)[pagePath] || {}
  const showHeader = config.showHeader !== false // Default to true
  const showActionZone = config.showActionZone !== false // Default to true
  const theme = currentUITheme.value
  const origin = url.origin
  const canonicalUrl = url.href

  const siteName = 'abyssion'
  const ogTitle = 'abyssion — official site'

  const rawDescription: string = typeof bio?.about === 'string' ? bio.about : ''
  const description = rawDescription
    .replace(/\s+/g, ' ')
    .slice(0, 160)
    .trim()

  type ShowData = ContentShowsEntry
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const _upcomingShows: ShowData[] = Array.isArray(shows)
    ? (shows as ShowData[]).filter((s: ShowData) => {
      const d = new Date(s.date)
      d.setHours(0, 0, 0, 0)
      return d >= today
    })
    : []

  const navData = nav as unknown as SiteNav
  const sameAs = Array.isArray(navData?.socialLinks) ? navData.socialLinks.map((s) => s.url).filter(Boolean) : []

  const logoUrl = `${origin}/static/logo.svg`
  const imageUrl = `${origin}/static/images/abyssion_logo_plain.png`

  const websiteLd: WebSiteLD = createWebsiteLD(siteName, origin)

  type BioMember = { id: string; name: string; role: string; bio?: string; image?: string }
  type BioData = { about?: string; members?: BioMember[]; albums?: unknown }

  const bioData = bio as unknown as BioData

  const members: PersonLD[] = Array.isArray(bioData?.members)
    ? bioData.members.map((m: BioMember) => ({
      '@type': 'Person',
      name: m.name,
      image: m.image,
      description: m.bio,
    }))
    : []

  const organizationLd: MusicGroupLD = createMusicGroupLD({
    origin,
    logoUrl,
    imageUrl,
    sameAs,
    contact: contact as ContentContact,
    description: typeof bioData?.about === 'string' ? bioData.about : undefined,
    members,
  })

  const eventsLd: MusicEventListLD | null = createMusicEventListLD(shows as ContentShowsEntry[], {
    canonicalUrl,
    siteOrigin: origin,
  })

  const albumsLd: MusicAlbumListLD | null = createMusicAlbumListLD(
    (bioData?.albums as { year: string; title?: string; description?: string; type?: string; tracks?: number }[]) || [],
    {
      artistName: 'Abyssion',
    },
  )

  return (
    <html lang='en'>
      <Head>
        <meta charset='utf-8' />
        <title>{ogTitle}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='description' content={description} />
        <meta name='robots' content='index,follow' />
        <link rel='canonical' href={canonicalUrl} />

        <meta property='og:site_name' content={siteName} />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={ogTitle} />
        <meta property='og:description' content={description} />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:image' content={imageUrl} />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={ogTitle} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={imageUrl} />

        <script type='application/ld+json'>{JSON.stringify(websiteLd)}</script>
        <script type='application/ld+json'>{JSON.stringify(organizationLd)}</script>
        {eventsLd && <script type='application/ld+json'>{JSON.stringify(eventsLd)}</script>}
        {albumsLd && <script type='application/ld+json'>{JSON.stringify(albumsLd)}</script>}

        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
        <link rel='stylesheet' href='/styles.css' />
      </Head>

      <body f-client-nav class='min-h-screen relative text-foreground bg-black' style={{ fontFamily: theme.typography.fontFamily.body }}>
        {/** global theme state and CSS custom properties */}
        <ThemeProvider />

        {/** renders debug controls and GL debugging tools */}
        <DebugPanels />

        {/** scroll events, themed background, GL canvas */}
        <SinglePageScrollManager />

        {/** desktop only, navigation and branding elements */}
        {showHeader && <Header />}

        {/** mobile only, floating action button and navigation menu */}
        {showActionZone && <ActionZoneController />}

        {/** main content area for each route */}
        <Partial name='page-content'>
          <Component />
        </Partial>
      </body>
    </html>
  )
}
