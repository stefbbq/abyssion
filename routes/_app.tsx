import { type PageProps } from '$fresh/server.ts'
import { Partial } from '$fresh/runtime.ts'
import Header from '@islands/Header.tsx'
import ActionZoneController from '@islands/ActionZoneController.tsx'
import ClientInitializer from '@islands/ClientInitializer.tsx'
import pagesConfig from '@data/pages.json' with { type: 'json' }
import type { PagesConfig } from '@data/types.ts'

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
      <body f-client-nav class='min-h-screen relative'>
        <ClientInitializer />
        {showHeader && (
          <div class='absolute top-0 left-0 right-0 z-50'>
            <Header currentPath={url.pathname} />
          </div>
        )}
        <main class='min-h-screen'>
          <Partial name='page-content'>
            <Component />
          </Partial>
        </main>
        {showActionZone && <ActionZoneController currentPath={url.pathname} />}
      </body>
    </html>
  )
}
