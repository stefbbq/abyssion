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
  const description = (seoConfig as { description?: string }).description || ''
  const sameAs = getSameAs(nav as unknown as SiteNav)
  const { origin, canonicalUrl, logoUrl, imageUrl } = getSeoMeta(url, seoConfig, description)
  const ogImageWidth = 1200
  const ogImageHeight = 675
  const ogImageAlt = ogTitle
  const websiteLd: WebSiteLD = createWebsiteLD(siteName, origin)
  // lcp preload attributes for hero image on home
  const lcpPreload = pagePath === '/'
    ? {
      imagesrcset: '/images/band_live-640.webp 640w, /images/band_live-1024.webp 1024w, /images/band_live.webp 1433w',
      imagesizes: '(min-width: 1024px) 1024px, (min-width: 640px) 640px, 100vw',
    }
    : null
  const bioData = bio as unknown as BioData
  const members = mapMembersToPersons(bioData?.members || [])
  const organizationLd: MusicGroupLD = createMusicGroupLD({
    origin,
    logoUrl,
    imageUrl,
    sameAs,
    contact: contact as ContentContact,
    description,
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
        <link rel='icon' href={(seoConfig as { faviconPath?: string }).faviconPath || '/favicon.webp'} />

        {/* prevent fouc - hide content until stylesheet loads */}
        <style>
          {`
          body { opacity: 0; }
          body.styles-loaded { opacity: 1; transition: opacity 150ms ease-in; }
        `}
        </style>

        {/* async css loading using media attribute trick - eliminates render blocking */}
        <link
          rel='stylesheet'
          href='/styles.css'
          media='print'
          {...({ onload: "this.media='all';document.body.classList.add('styles-loaded')" } as unknown as Record<string, string>)}
        />
        <noscript>
          <link rel='stylesheet' href='/styles.css' />
          <style>{`body { opacity: 1; }`}</style>
        </noscript>

        {/* safari/iOS toolbar translucency */}
        <meta name='theme-color' content='rgba(0,0,0,0)' media='(prefers-color-scheme: dark)' />
        <meta name='theme-color' content='rgba(255,255,255,0)' media='(prefers-color-scheme: light)' />
        <meta name='description' content={description} />
        <meta name='robots' content='index,follow' />
        <link rel='canonical' href={canonicalUrl} />

        {/* gl logo textures preload for faster gl initialization */}
        <link rel='preload' href='/media/images/abyssion_logo_stencil-transparent.png' as='image' />
        <link rel='preload' href='/media/images/abyssion_logo_outline-transparent.png' as='image' />
        <link rel='preload' href='/media/images/abyssion_logo_outline_mobile-transparent.webp' as='image' />

        {/* lcp image preload for home page to make request discoverable early */}
        {lcpPreload && (
          <link
            rel='preload'
            as='image'
            href='/images/band_live.webp'
            {...({ imagesrcset: lcpPreload.imagesrcset, imagesizes: lcpPreload.imagesizes } as unknown as Record<string, string>)}
          />
        )}

        {/* open graph */}
        <meta property='og:site_name' content={siteName} />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={ogTitle} />
        <meta property='og:description' content={description} />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:image' content={imageUrl} />
        <meta property='og:image:width' content={`${ogImageWidth}`} />
        <meta property='og:image:height' content={`${ogImageHeight}`} />
        <meta property='og:image:alt' content={ogImageAlt} />

        {/* twitter */}
        <meta name='twitter:card' content={twitterCard} />
        <meta name='twitter:title' content={ogTitle} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={imageUrl} />
        <meta name='twitter:image:alt' content={ogImageAlt} />

        {/* json-ld */}
        <script type='application/ld+json'>{JSON.stringify(websiteLd)}</script>
        <script type='application/ld+json'>{JSON.stringify(organizationLd)}</script>
        {eventsLd && <script type='application/ld+json'>{JSON.stringify(eventsLd)}</script>}
        {albumsLd && <script type='application/ld+json'>{JSON.stringify(albumsLd)}</script>}

        {/* fonts */}
        <link rel='preconnect' href='https://fonts.googleapis.com' crossOrigin='anonymous' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link media='print' href='https://fonts.googleapis.com' />
        <link media='print' href='https://fonts.gstatic.com' crossOrigin='true' />
      </Head>

      <body
        f-client-nav
        class='min-h-screen relative text-foreground'
        style={{
          fontFamily: theme.typography.body.fontFamily,
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
