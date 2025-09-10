import { Head } from '$fresh/runtime.ts'
import { type PageProps } from '$fresh/server.ts'

import ContentPageOrchestrator from '@islands/ContentPageOrchestrator.tsx'
import AuditionsPartial, { type PageData } from './partials/auditions.tsx'

export default function AuditionsPage(props: PageProps<PageData>) {
  return (
    <>
      <Head>
        <title>abyssion - auditions</title>
        <meta name='robots' content='noindex,follow' />
      </Head>

      <AuditionsPartial {...props} />
      <ContentPageOrchestrator />
    </>
  )
}
