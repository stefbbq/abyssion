import { Handlers, PageProps } from '$fresh/server.ts'

import { Shell } from '@components/Shell.tsx'
import { ShellImage } from '@components/ShellImage.tsx'
import { Title } from '@components/Title.tsx'
import { TextBlock } from '@components/TextBlock.tsx'
import { InlineMarkdown } from '@components/InlineMarkdown.tsx'
import auditionsContent from '@data/content-auditions.json' with { type: 'json' }
import type { ContentAuditions } from '@data/types.ts'
import { createDefinitionListHtml } from '@lib/email/sendEmailSendGrid.ts'
import { sendEmail } from '@lib/email/emailService.ts'
import FormManager, { type FormConfig } from '@islands/FormManager.tsx'
import formSchema from '@data/form-auditions.json' with { type: 'json' }

type Submission = {
  fullName: string
  email: string
  ageRangeThirtyToFortyFive: string | null
  singsAndScreams: string | null
  likesListedBands: string | null
  canRehearseAndGig: string | null
  iCanTravel: string | null
  demoUrl: string
  demoDescription: string
  additionalDetails: string
}

export type PageData = {
  submitted?: Submission
  errors?: Record<string, string>
}

const requiredCheckboxKeys = [
  'ageRangeThirtyToFortyFive',
  'singsAndScreams',
  'likesListedBands',
  'canRehearseAndGig',
  'iCanTravel',
] as const

const content = auditionsContent as unknown as ContentAuditions

export const handler: Handlers<PageData> = {
  async POST(req, ctx) {
    const form = await req.formData()
    const get = (key: string) => String(form.get(key) || '')
    const getMaybe = (key: string) => (form.get(key) ? String(form.get(key)) : null)

    const submission: Submission = {
      fullName: get('fullName'),
      email: get('email'),
      ageRangeThirtyToFortyFive: getMaybe('ageRangeThirtyToFortyFive'),
      singsAndScreams: getMaybe('singsAndScreams'),
      likesListedBands: getMaybe('likesListedBands'),
      canRehearseAndGig: getMaybe('canRehearseAndGig'),
      iCanTravel: getMaybe('iCanTravel'),
      demoUrl: get('demoUrl'),
      demoDescription: get('demoDescription'),
      additionalDetails: get('additionalDetails'),
    }

    const errors: Record<string, string> = {}

    if (!submission.fullName.trim()) errors.fullName = 'your name is required'
    if (!submission.email.trim()) errors.email = 'email is required'
    if (!submission.demoUrl.trim()) errors.demoUrl = 'demo link is required'
    if (!submission.demoDescription.trim()) errors.demoDescription = 'please describe your demo'
    if (!submission.additionalDetails.trim()) errors.additionalDetails = 'please add more details'

    for (const key of requiredCheckboxKeys) {
      if (!submission[key]) errors[key] = 'required'
    }

    if (Object.keys(errors).length > 0) {
      return await ctx.render({ errors }, { status: 400 })
    }

    // send email notification
    try {
      const html = createDefinitionListHtml('New Audition Submission', {
        fullName: submission.fullName,
        email: submission.email,
        demoUrl: submission.demoUrl,
        demoDescription: submission.demoDescription,
        additionalDetails: submission.additionalDetails,
        ageRangeThirtyToFortyFive: submission.ageRangeThirtyToFortyFive,
        singsAndScreams: submission.singsAndScreams,
        likesListedBands: submission.likesListedBands,
        canRehearseAndGig: submission.canRehearseAndGig,
        iCanTravel: submission.iCanTravel,
      })
      const subject = `Audition submission from ${submission.fullName}`
      const text = `New audition submission from ${submission.fullName} (${submission.email}). Demo: ${submission.demoUrl}`
      const result = await sendEmail({ kind: 'auditions', subject, text, html, replyTo: submission.email })
      if (!result.ok) return await ctx.render({ errors: { _form: result.message } }, { status: 500 })
    } catch (err) {
      console.error('auditions email send failed (unexpected)', err)
      return await ctx.render({ errors: { _form: 'failed to send your submission, please try again later' } }, { status: 500 })
    }

    return await ctx.render({ submitted: submission })
  },
}

export default function AuditionsPartial(props?: PageProps<PageData>) {
  const { submitted, errors } = props?.data || {}

  // on submitted
  if (submitted) {
    return (
      <div class='max-w-3xl mx-auto'>
        <Shell>
          <Title>{content.submitted.title}</Title>
          <div class='flex flex-col items-center gap-6'>
            <p class='text-[var(--colors-text-secondary)]'>{content.submitted.thanksBody}</p>
            <div class='w-full text-sm text-[var(--colors-text-tertiary)] space-y-1'>
              <p>
                <span class='opacity-70'>{content.submitted.nameLabel}:</span> {submitted.fullName}
              </p>
              <p>
                <span class='opacity-70'>{content.submitted.emailLabel}:</span> {submitted.email}
              </p>
              <p>
                <span class='opacity-70'>{content.submitted.demoLabel}:</span>{' '}
                <a class='underline' href={submitted.demoUrl} target='_blank' rel='noreferrer'>{submitted.demoUrl}</a>
              </p>
              <p class='whitespace-pre-wrap'>
                <span class='opacity-70'>{content.submitted.demoDescriptionLabel}:</span> {submitted.demoDescription}
              </p>
              {submitted.additionalDetails && (
                <p class='whitespace-pre-wrap'>
                  <span class='opacity-70'>{content.submitted.additionalDetailsLabel}:</span> {submitted.additionalDetails}
                </p>
              )}
            </div>
          </div>
        </Shell>
      </div>
    )
  }

  const _errorText = (field: string) => (errors && errors[field] ? errors[field] : null)

  // form
  return (
    <main class='max-w-4xl mx-auto mt-8 mb-8'>
      <Shell>
        <Title>{content.title}</Title>

        <div class='space-y-8 text-[var(--colors-text-secondary)]'>
          <TextBlock>{content.sections.introBody}</TextBlock>

          <ShellImage height='300px' yPosition={55} src='/images/band_setup.webp' alt='Abyssion live' />

          {/* you might be a good fit */}
          <div>
            <h2 class='text-[var(--colors-text-primary)] mb-2'>{content.sections.youMightBeAGoodFitTitle}</h2>
            <ul class='list-disc pl-0 ml-5 space-y-1'>
              {content.sections.youMightBeAGoodFitBody.map((item) => (
                <li key={item}>
                  <InlineMarkdown as='span'>{item}</InlineMarkdown>
                </li>
              ))}
            </ul>
          </div>

          {/* requirements */}
          <div>
            <h2 class='text-[var(--colors-text-primary)] mb-2'>
              {content.sections.requirementsTitle}
              <small class='text-[var(--colors-text-secondary)]'>{content.sections.requirementsSubtitle}</small>
            </h2>
            <ul class='list-disc pl-0 ml-5 space-y-1'>
              {content.sections.requirementsBody.map((item) => (
                <li key={item}>
                  <InlineMarkdown as='span'>{item}</InlineMarkdown>
                </li>
              ))}
            </ul>
          </div>

          {/* process */}
          <div>
            <h2 class='text-[var(--colors-text-primary)]  mb-2'>{content.sections.processTitle}</h2>
            <ul class='list-disc pl-0 space-y-1'>
              {content.sections.processBody.map((item) => (
                <li key={item} class='ml-5'>
                  <InlineMarkdown as='span'>{item}</InlineMarkdown>
                </li>
              ))}
            </ul>
          </div>

          {/* more about us */}
          <div>
            <h2 class='text-[var(--colors-text-primary)] mb-2'>{content.sections.moreAboutUs || ''}</h2>
            <TextBlock>{content.sections.moreAboutUsBody || ''}</TextBlock>
          </div>
        </div>

        <FormManager config={formSchema as unknown as FormConfig} labels={content.form} errors={errors || {}} />
      </Shell>
    </main>
  )
}
