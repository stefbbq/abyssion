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
  const isHomePage = pagePath === '/'
  const config = (pagesConfig as PagesConfig)[pagePath] || {}
  const showHeader = config.showHeader !== false // Default to true
  const showActionZone = config.showActionZone !== false // Default to true

  console.log('isHomePage', isHomePage)

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
        <div class='fixed inset-0'>
          <div class='w-full h-full flex items-center justify-center'>
            <GLCanvas width={1400} height={896} />
          </div>
        </div>

        {/* header */}
        {showHeader && (
          <div class='absolute top-0 left-0 right-0 z-50'>
            <Header currentPath={url.pathname} />
          </div>
        )}

        {/* main content */}
        <PageContainer>
          <Partial name='page-content'>
            <Component />
          </Partial>
        </PageContainer>

        {/* action zone */}
        {showActionZone && (
          <div class='relative z-20'>
            <ActionZoneController currentPath={url.pathname} />
          </div>
        )}
      </body>
    </html>
  )
}
