import { type PageProps } from '$fresh/server.ts'
import { Partial } from '$fresh/runtime.ts'
import Header from '@islands/Header.tsx'
import ActionZoneController from '@islands/ActionZoneController.tsx'

export default function App({ Component, url }: PageProps) {
  return (
    <html>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>abyssion</title>
        <link rel='stylesheet' href='/styles.css' />
      </head>
      <body f-client-nav class='min-h-screen relative'>
        <div class='absolute top-0 left-0 right-0 z-50'>
          <Header currentPath={url.pathname} />
        </div>
        <main class='min-h-screen'>
          <Partial name='page-content'>
            <Component />
          </Partial>
        </main>
        <ActionZoneController currentPath={url.pathname} />
      </body>
    </html>
  )
}
