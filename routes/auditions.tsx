import { Head } from '$fresh/runtime.ts'
import { type PageProps } from '$fresh/server.ts'

import { Section } from '@components/Section.tsx'
import ContentPageOrchestrator from '@islands/ContentPageOrchestrator.tsx'
import AuditionsPartial, { type PageData } from './partials/auditions.tsx'

export default function AuditionsPage(props: PageProps<PageData>) {
  return (
    <main class='space-y-8'>
      <Head>
        <title>abyssion - auditions</title>
        <meta name='robots' content='noindex,follow' />
      </Head>

      <Section id='auditions'>
        <AuditionsPartial {...props} />
      </Section>

      <ContentPageOrchestrator />
    </main>
  )
}
