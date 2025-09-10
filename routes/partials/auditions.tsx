import { Handlers, PageProps } from '$fresh/server.ts'

import { Shell } from '@components/Shell.tsx'
import { ShellImage } from '@components/ShellImage.tsx'
import { Title } from '@components/Title.tsx'
import { Button } from '@components/Button.tsx'
import Toggle from '@components/Toggle.tsx'
import { TextBlock } from '@components/TextBlock.tsx'
import { TextField } from '@components/TextField.tsx'
import InlineMarkdown from '@components/InlineMarkdown.tsx'
import auditionsContent from '@data/content-auditions.json' with { type: 'json' }
import type { ContentAuditions } from '@data/types.ts'

type Submission = {
  fullName: string
  email: string
  ageRangeThirtyToFortyFive: string | null
  singsAndScreams: string | null
  likesListedBands: string | null
  establishedNonCareer: string | null
  canRehearseAndGig: string | null
  demoUrl: string
  demoDescription: string
  additionalDetails: string
  recordingAcknowledged: string | null
  inPersonAcknowledged: string | null
}

export type PageData = {
  submitted?: Submission
  errors?: Record<string, string>
}

const requiredCheckboxKeys = [
  'ageRangeThirtyToFortyFive',
  'singsAndScreams',
  'likesListedBands',
  'establishedNonCareer',
  'canRehearseAndGig',
  'recordingAcknowledged',
  'inPersonAcknowledged',
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
      establishedNonCareer: getMaybe('establishedNonCareer'),
      canRehearseAndGig: getMaybe('canRehearseAndGig'),
      demoUrl: get('demoUrl'),
      demoDescription: get('demoDescription'),
      additionalDetails: get('additionalDetails'),
      recordingAcknowledged: getMaybe('recordingAcknowledged'),
      inPersonAcknowledged: getMaybe('inPersonAcknowledged'),
    }

    const errors: Record<string, string> = {}

    if (!submission.fullName.trim()) errors.fullName = 'your name is required'
    if (!submission.email.trim()) errors.email = 'email is required'
    if (!submission.demoUrl.trim()) errors.demoUrl = 'demo link is required'
    if (!submission.demoDescription.trim()) errors.demoDescription = 'please describe your demo'

    for (const key of requiredCheckboxKeys) {
      if (!submission[key]) errors[key] = 'required'
    }

    if (Object.keys(errors).length > 0) {
      return await ctx.render({ errors }, { status: 400 })
    }

    // In a real app, persist to a database or send an email here

    return await ctx.render({ submitted: submission })
  },
}

export default function AuditionsPartial(props?: PageProps<PageData>) {
  const { submitted, errors } = props?.data || {}

  if (submitted) {
    return (
      <div class='max-w-3xl mx-auto'>
        <Shell>
          <Title>{content.submitted.title}</Title>
          <div class='flex flex-col items-center gap-6'>
            <img src='/images/abyssion_logo_plain-transparent.png' alt='Abyssion' class='h-16 opacity-90' />
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

  const errorText = (field: string) => (errors && errors[field] ? errors[field] : null)

  return (
    <main class='max-w-4xl mx-auto mt-8 mb-8'>
      <Shell>
        <Title>{content.title}</Title>

        <div class='space-y-8 text-[var(--colors-text-secondary)]'>
          <TextBlock>{content.sections.introBody}</TextBlock>

          <ShellImage height='300px' yPosition={25} src='/images/band_setup.webp' alt='Abyssion live' />

          {/* you might be a good fit */}
          <div>
            <h2 class='text-[var(--colors-text-primary)] mb-2'>{content.sections.youMightBeAGoodFitTitle}</h2>
            <ul class='list-disc pl-0 ml-5 space-y-1'>
              {content.sections.youMightBeAGoodFitBody.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          {/* requirements */}
          <div>
            <h2 class='text-[var(--colors-text-primary)] mb-2'>{content.sections.requirementsTitle}</h2>
            <ul class='list-disc pl-0 ml-5 space-y-1'>
              {content.sections.requirementsBody.map((item) => <li key={item}>{item}</li>)}
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

          {/* final note */}
          <div>
            <TextBlock variant='primary'>{content.sections.finalNote || ''}</TextBlock>
          </div>
        </div>

        <form method='POST' action='/partials/auditions' f-partial='/partials/auditions' class='mt-8 space-y-6'>
          {/* name and email */}
          <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <TextField label={content.form.nameLabel} name='fullName' required className={errorText('fullName') ? 'border-red-500' : ''} />
            <TextField label={content.form.emailLabel} name='email' type='email' required className={errorText('email') ? 'border-red-500' : ''} />
          </div>

          {/* demo */}
          <div class='grid grid-cols-1 gap-4'>
            <TextField
              label={content.form.demoUrlLabel}
              name='demoUrl'
              type='url'
              required
              className={errorText('demoUrl') ? 'border-red-500' : ''}
              placeholder='https://...'
            />
            <TextField
              label={content.form.demoDescriptionLabel}
              name='demoDescription'
              textarea
              rows={4}
              required
              className={errorText('demoDescription') ? 'border-red-500' : ''}
            />
          </div>

          {/* additional details */}
          <TextField label={content.form.additionalDetailsLabel} name='additionalDetails' textarea rows={5} />

          {/* confirm requirements */}
          <div class='space-y-2'>
            <h2 class='text-sm text-[var(--colors-text-secondary)]'>{content.form.confirmRequirementsHeading}</h2>
            <div class='grid grid-cols-1 gap-2'>
              <Toggle
                name='ageRangeThirtyToFortyFive'
                labelNode={<InlineMarkdown as='span'>{content.form.toggles.ageRangeThirtyToFortyFive}</InlineMarkdown>}
                error={errorText('ageRangeThirtyToFortyFive')}
                required
              />
              <Toggle
                name='singsAndScreams'
                labelNode={<InlineMarkdown as='span'>{content.form.toggles.singsAndScreams}</InlineMarkdown>}
                error={errorText('singsAndScreams')}
                required
              />
              <Toggle
                name='likesListedBands'
                labelNode={<InlineMarkdown as='span'>{content.form.toggles.likesListedBands}</InlineMarkdown>}
                error={errorText('likesListedBands')}
                required
              />
              <Toggle
                name='canRehearseAndGig'
                labelNode={<InlineMarkdown as='span'>{content.form.toggles.canRehearseAndGig}</InlineMarkdown>}
                error={errorText('canRehearseAndGig')}
                required
              />
              <Toggle
                name='iCanTravel'
                labelNode={<InlineMarkdown as='span'>{content.form.toggles.iCanTravel}</InlineMarkdown>}
                error={errorText('iCanTravel')}
                required
              />
            </div>
          </div>

          <div class='pt-2'>
            <Button type='submit' variant='primary' size='md'>{content.form.submitLabel}</Button>
          </div>

          {errors && Object.keys(errors).length > 0 && <div class='text-sm text-red-500'>{content.form.errorFixHighlighted}</div>}
        </form>
      </Shell>
    </main>
  )
}
