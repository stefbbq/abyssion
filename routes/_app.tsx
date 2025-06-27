import { type PageProps } from '$fresh/server.ts'
import { Partial } from '$fresh/runtime.ts'
import Header from '@islands/Header.tsx'
import ActionZoneController from '@islands/ActionZoneController.tsx'
import GLCanvas from '@islands/GLCanvas.tsx'
import pagesConfig from '@data/pages.json' with { type: 'json' }
import type { PagesConfig } from '@data/types.ts'
import PageContainer from '@islands/PageContainer.tsx'

export default function App({ Component, url }: PageProps) {
  const pagePath = url.pathname
  const config = (pagesConfig as PagesConfig)[pagePath] || {}
  const showHeader = config.showHeader !== false // Default to true
  const showActionZone = config.showActionZone !== false // Default to true

  return (
    <html>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>abyssion</title>
        <link rel='stylesheet' href='/styles.css' />
      </head>
      <body f-client-nav class='min-h-screen relative bg-black'>
        {/* gl canvas */}
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
