import { type PageProps } from '$fresh/server.ts'
import { Head, Partial } from '$fresh/runtime.ts'
import Header from '@islands/Header.tsx'
import ActionZoneController from '@islands/ActionZoneController.tsx'
import GLCanvas from '@islands/GLCanvas.tsx'
import pagesConfig from '@data/pages.json' with { type: 'json' }
import type { PagesConfig } from '@data/types.ts'
import PageContainer from '@islands/PageContainer.tsx'
import ThemeProvider from '@islands/ThemeProvider.tsx'
import { currentTheme } from '@lib/theme/index.ts'
import ThemedBackground from '@islands/ThemedBackground.tsx'

export default function App({ Component, url }: PageProps) {
  const pagePath = url.pathname
  const config = (pagesConfig as PagesConfig)[pagePath] || {}
  const showHeader = config.showHeader !== false // Default to true
  const showActionZone = config.showActionZone !== false // Default to true
  const theme = currentTheme.value

  return (
    <html lang='en'>
      <Head>
        <meta charset='utf-8' />
        <title>abyssion</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
        <link href='https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700&display=swap' rel='stylesheet' />
        <link rel='stylesheet' href='/styles.css' />
      </Head>
      <body f-client-nav class='min-h-screen relative bg-black' style={{ fontFamily: theme.typography.fontFamily }}>
        <ThemedBackground />
        <ThemeProvider />
        <GLCanvas />

        {/* header */}
        {showHeader && <Header />}

        {/* main content */}
        <PageContainer>
          <Partial name='page-content'>
            <Component />
          </Partial>
        </PageContainer>

        {/* action zone */}
        {showActionZone && <ActionZoneController />}
      </body>
    </html>
  )
}
