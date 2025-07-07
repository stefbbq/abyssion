import { type PageProps } from '$fresh/server.ts'
import { Head, Partial } from '$fresh/runtime.ts'
import Header from '@islands/Header.tsx'
import ActionZoneController from '@islands/ActionZoneController.tsx'
import GLCanvasController from '@islands/GLCanvasController.tsx'
import { DebugPanels } from '@islands/DebugPanels.tsx'
import pagesConfig from '@data/pages.json' with { type: 'json' }
import type { PagesConfig } from '@data/types.ts'
import PageContainer from '@islands/PageContainer.tsx'
import ThemeProvider from '@islands/ThemeProvider.tsx'
import { currentUITheme } from '@lib/theme/index.ts'
import ThemedBackground from '@islands/ThemedBackground.tsx'
import videoManifest from '../static/videos/manifest.json' with { type: 'json' }

export default function App({ Component, url }: PageProps) {
  const pagePath = url.pathname
  const config = (pagesConfig as PagesConfig)[pagePath] || {}
  const showHeader = config.showHeader !== false // Default to true
  const showActionZone = config.showActionZone !== false // Default to true
  const theme = currentUITheme.value
  const preloadVideos = (videoManifest as string[]).slice(0, 2)

  return (
    <html lang='en'>
      <Head>
        <meta charset='utf-8' />
        <title>abyssion</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
        <link rel='stylesheet' href='/styles.css' />
        {preloadVideos.map((filename) => <link rel='preload' as='video' href={`/videos/${filename}`} key={filename} />)}
      </Head>
      <body f-client-nav class='min-h-screen relative text-foreground' style={{ fontFamily: theme.typography.fontFamily.body }}>
        <ThemedBackground />

        <ThemeProvider />

        <GLCanvasController />

        <DebugPanels />

        {showHeader && <Header />}

        <PageContainer>
          <Partial name='page-content'>
            <Component />
          </Partial>
        </PageContainer>

        {showActionZone && <ActionZoneController />}
      </body>
    </html>
  )
}
