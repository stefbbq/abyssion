import { type PageProps } from '$fresh/server.ts'
import { Head, Partial } from '$fresh/runtime.ts'

import type { ContentContact, ContentShowsEntry, PagesConfig, SiteNav } from '@data/types.ts'
import type { MusicAlbumListLD, MusicEventListLD, MusicGroupLD, WebSiteLD } from '@lib/seo/ld.types.ts'
import Header from '@islands/Header.tsx'
import ActionZoneController from '@islands/ActionZoneController.tsx'
import { DebugPanels } from '@islands/DebugPanels.tsx'
import pagesConfig from '@data/pages.json' with { type: 'json' }
import ThemeProvider from '@islands/ThemeProvider.tsx'
import { currentUITheme } from '@lib/theme/index.ts'
import PageManager from '@islands/PageManager.tsx'
import {
  createMusicAlbumListLD,
  createMusicEventListLD,
  createMusicGroupLD,
  createWebsiteLD,
  getCleanDescription,
  getSameAs,
  getSeoMeta,
  mapMembersToPersons,
} from '@lib/seo/index.ts'
import seoConfig from '@data/seo.json' with { type: 'json' }
import bio from '@data/content-bio.json' with { type: 'json' }
import shows from '@data/content-shows.json' with { type: 'json' }
import nav from '@data/nav.json' with { type: 'json' }
import contact from '@data/content-contact.json' with { type: 'json' }
import type { BandMember } from '@data/types.ts'

type BioData = { about?: string; members?: BandMember[]; albums?: unknown }

export default function App({ Component, url }: PageProps) {
  const { siteName, ogTitle } = seoConfig as { siteName: string; ogTitle: string; twitterCard?: string }
  const twitterCard = (seoConfig as { twitterCard?: string }).twitterCard || 'summary_large_image'
  const pagePath = url.pathname
  const config = (pagesConfig as PagesConfig)[pagePath] || {}
  const showHeader = config.showHeader !== false
  const showActionZone = config.showActionZone !== false
  const theme = currentUITheme.value

  // seo meta
  const description = getCleanDescription((bio as unknown as { about?: string })?.about)
  const sameAs = getSameAs(nav as unknown as SiteNav)
  const { origin, canonicalUrl, logoUrl, imageUrl } = getSeoMeta(url, seoConfig, description)
  const websiteLd: WebSiteLD = createWebsiteLD(siteName, origin)
  const bioData = bio as unknown as BioData
  const members = mapMembersToPersons(bioData?.members || [])
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
    { artistName: (seoConfig as { artistName?: string }).artistName || 'Abyssion' },
  )

  return (
    <html lang='en'>
      <Head>
        <meta charset='utf-8' />
        <title>{ogTitle}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' />
        <link rel='icon' href='/favicon.webp' />
        <link rel='stylesheet' defer href='/styles.css' />

        {/* safari/iOS toolbar translucency */}
        <meta name='theme-color' content='rgba(0,0,0,0)' media='(prefers-color-scheme: dark)' />
        <meta name='theme-color' content='rgba(255,255,255,0)' media='(prefers-color-scheme: light)' />
        <meta name='description' content={description} />
        <meta name='robots' content='index,follow' />
        <link rel='canonical' href={canonicalUrl} />

        {/* open graph */}
        <meta property='og:site_name' content={siteName} />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={ogTitle} />
        <meta property='og:description' content={description} />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:image' content={imageUrl} />

        {/* twitter */}
        <meta name='twitter:card' content={twitterCard} />
        <meta name='twitter:title' content={ogTitle} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={imageUrl} />

        {/* json-ld */}
        <script type='application/ld+json'>{JSON.stringify(websiteLd)}</script>
        <script type='application/ld+json'>{JSON.stringify(organizationLd)}</script>
        {eventsLd && <script type='application/ld+json'>{JSON.stringify(eventsLd)}</script>}
        {albumsLd && <script type='application/ld+json'>{JSON.stringify(albumsLd)}</script>}

        {/* fonts */}
        <link media='print' href='https://fonts.googleapis.com' />
        <link media='print' href='https://fonts.gstatic.com' crossOrigin='true' />
      </Head>

      <body
        f-client-nav
        class='min-h-screen relative text-foreground'
        style={{
          fontFamily: theme.typography.fontFamily.body,
          backgroundColor: '#1a1a1a',
          backgroundImage: 'linear-gradient(to bottom, #3a3a3a 0%, #121212 100%), url("/images/noise.png")',
          backgroundBlendMode: 'normal, soft-light',
          backgroundRepeat: 'no-repeat, repeat',
          backgroundSize: 'auto, 200px 100px',
          backgroundAttachment: 'fixed, fixed',
        }}
      >
        {/** global theme state and CSS custom properties */}
        <ThemeProvider />

        {/** renders debug controls and GL debugging tools */}
        <DebugPanels />

        {/** scroll events, themed background, GL canvas */}
        <div key={pagePath}>
          <PageManager enabledPaths={['/']} />
        </div>

        {/** page chrome that must react to route changes */}
        <Partial name='app-chrome'>
          {/** desktop only, navigation and branding elements */}
          {showHeader && <Header />}

          {/** mobile only, floating action button and navigation menu */}
          {showActionZone && <ActionZoneController />}
        </Partial>

        {/** main content area for each route */}
        <Partial name='page-content'>
          <Component />
        </Partial>
      </body>
    </html>
  )
}
