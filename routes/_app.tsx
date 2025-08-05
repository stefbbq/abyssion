import { type PageProps } from '$fresh/server.ts'
import { Head, Partial } from '$fresh/runtime.ts'
import Header from '@islands/Header.tsx'
import ActionZoneController from '@islands/ActionZoneController.tsx'
import { DebugPanels } from '@islands/DebugPanels.tsx'
import pagesConfig from '@data/pages.json' with { type: 'json' }
import type { PagesConfig } from '@data/types.ts'
import ThemeProvider from '@islands/ThemeProvider.tsx'
import { currentUITheme } from '@lib/theme/index.ts'
import SinglePageScrollManager from '@islands/SinglePageScrollManager.tsx'

export default function App({ Component, url }: PageProps) {
  const pagePath = url.pathname
  const config = (pagesConfig as PagesConfig)[pagePath] || {}
  const showHeader = config.showHeader !== false // Default to true
  const showActionZone = config.showActionZone !== false // Default to true
  const theme = currentUITheme.value

  return (
    <html lang='en'>
      <Head>
        <meta charset='utf-8' />
        <title>abyssion</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
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
