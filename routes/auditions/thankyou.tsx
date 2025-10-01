import { Head } from '$fresh/runtime.ts'
import { Shell } from '@components/Shell.tsx'
import { Title } from '@components/Title.tsx'
import { Button } from '@components/Button.tsx'
import auditionsContent from '@data/content-auditions.json' with { type: 'json' }
// import { TextBlock } from '@components/TextBlock.tsx'
import { Handlers, type PageProps } from '$fresh/server.ts'

type QueryData = {
  name?: string
  email?: string
  demo?: string
  demoDescription?: string
  additionalDetails?: string
}

type SubmittedData = {
  title: string
  thanksBody: string
  nameLabel: string
  emailLabel: string
  demoLabel: string
  demoDescriptionLabel: string
  additionalDetailsLabel: string
}

export const handler: Handlers<QueryData> = {
  async GET(req, ctx) {
    const url = new URL(req.url)
    // data can be passed via query, but keep size small
    const data: QueryData = {
      name: url.searchParams.get('n') || undefined,
      email: url.searchParams.get('e') || undefined,
      demo: url.searchParams.get('d') || undefined,
      demoDescription: url.searchParams.get('dd') || undefined,
      additionalDetails: url.searchParams.get('ad') || undefined,
    }
    return await ctx.render(data)
  },
}

export default function AuditionsThankYou(props: PageProps<QueryData>) {
  const content = auditionsContent as unknown as { submitted: SubmittedData }
  const data = props.data || {}

  return (
    <main class='min-h-[calc(100vh-80px)] flex items-center justify-center'>
      <Head>
        <title>abyssion - thanks</title>
        <meta name='robots' content='noindex,follow' />
      </Head>

      <div class='w-full'>
        <Shell className='max-w-3xl mx-auto'>
          <div class='flex flex-col gap-6 text-left items-stretch'>
            <Title>{content.submitted.title}</Title>

            {(data.name || data.email || data.demo || data.demoDescription || data.additionalDetails) && (
              <table class='w-full border-collapse text-left leading-6'>
                <tbody>
                  {data.name && (
                    <tr>
                      <td class='py-1 pr-4 align-top opacity-70 w-[30%]'>{content.submitted.nameLabel}:</td>
                      <td class='py-1 align-top text-[var(--colors-text-tertiary)] w-[70%]'>{data.name}</td>
                    </tr>
                  )}
                  {data.email && (
                    <tr>
                      <td class='py-1 pr-4 align-top opacity-70 w-[30%]'>{content.submitted.emailLabel}:</td>
                      <td class='py-1 align-top text-[var(--colors-text-tertiary)] w-[70%]'>{data.email}</td>
                    </tr>
                  )}
                  {data.demo && (
                    <tr>
                      <td class='py-1 pr-4 align-top opacity-70 w-[30%]'>{content.submitted.demoLabel}:</td>
                      <td class='py-1 align-top text-[var(--colors-text-tertiary)] w-[70%]'>
                        <a class='underline' href={data.demo} target='_blank' rel='noreferrer'>{data.demo}</a>
                      </td>
                    </tr>
                  )}
                  {data.demoDescription && (
                    <tr>
                      <td class='py-1 pr-4 align-top opacity-70 w-[30%]'>{content.submitted.demoDescriptionLabel}:</td>
                      <td class='py-1 align-top text-[var(--colors-text-tertiary)] w-[70%]'>
                        <div class='whitespace-pre-wrap'>{data.demoDescription}</div>
                      </td>
                    </tr>
                  )}
                  {data.additionalDetails && (
                    <tr>
                      <td class='py-1 pr-4 align-top opacity-70 w-[30%]'>{content.submitted.additionalDetailsLabel}:</td>
                      <td class='py-1 align-top text-[var(--colors-text-tertiary)] w-[70%]'>
                        <div class='whitespace-pre-wrap'>{data.additionalDetails}</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <p class='text-[var(--colors-text-secondary)] max-w-prose'>{content.submitted.thanksBody}</p>

            <div class='pt-8 '>
              <Button href='/' noPartial hoverReveal variant='primary' size='md'>back to home</Button>
            </div>
          </div>
        </Shell>
      </div>
    </main>
  )
}
