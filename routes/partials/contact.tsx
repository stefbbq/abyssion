import { Handlers, PageProps } from '$fresh/server.ts'

import { Shell } from '@components/Shell.tsx'
import contact from '@data/content-contact.json' with { type: 'json' }
import { Title } from '@components/Title.tsx'
import FormManager, { type FormConfig } from '@islands/FormManager.tsx'
import formSchema from '@data/form-contact.json' with { type: 'json' }
import { createDefinitionListHtml } from '@lib/email/sendEmailSendGrid.ts'
import { sendEmail } from '@lib/email/emailService.ts'
import LinksPartial from './links.tsx'

type PageData = { submitted?: { fullName: string; email: string; subject: string; message: string; extra?: string }; errors?: Record<string, string> }

export const handler: Handlers<PageData> = {
  async POST(req, ctx) {
    const form = await req.formData()
    const get = (k: string) => String(form.get(k) || '')
    const submission = {
      fullName: get('fullName'),
      email: get('email'),
      subject: get('subject'),
      message: get('message'),
      extra: get('extra'),
    }
    const errors: Record<string, string> = {}
    if (!submission.fullName.trim()) errors.fullName = 'your name is required'
    if (!submission.email.trim()) errors.email = 'email is required'
    if (!submission.subject.trim()) errors.subject = 'subject is required'
    if (!submission.message.trim()) errors.message = 'message is required'

    if (Object.keys(errors).length > 0) return await ctx.render({ errors }, { status: 400 })

    try {
      const html = createDefinitionListHtml('New Contact Message', submission)
      const subject = `Contact: ${submission.subject}`
      const result = await sendEmail({ kind: 'contact', subject, text: submission.message, html, replyTo: submission.email })
      if (!result.ok) return await ctx.render({ errors: { _form: result.message } }, { status: 500 })
    } catch (err) {
      console.error('contact email send failed (unexpected)', err)
      return await ctx.render({ errors: { _form: 'failed to send your message, please try again later' } }, { status: 500 })
    }

    return await ctx.render({ submitted: submission })
  },
}

export default function ContactSection(props?: PageProps<PageData>) {
  const { submitted: _submitted, errors } = props?.data || {}
  const labels = { submitLabel: 'Send', nameLabel: 'Your name', emailLabel: 'Your email address', subjectLabel: 'Subject', messageLabel: 'Message' }

  return (
    <>
      <div class='grid gap-8 lg:grid-cols-1'>
        <Shell>
          <Title>{contact.title}</Title>
          <div class='space-y-4'>
            <div class='flex items-center space-x-3'>
              <div class='flex-shrink-0'>
                <svg class='w-5 h-5 text-[var(--colors-text-tertiary)]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <div>
                <a class='text-[var(--colors-text-primary)]' href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            </div>
            <div class='flex items-center space-x-3'>
              <div class='flex-shrink-0'>
                <svg class='w-5 h-5 text-[var(--colors-text-tertiary)]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>
              <div>
                <p class='text-sm text-[var(--colors-text-secondary)]'>{contact.locationLabel}</p>
                <p class='text-[var(--colors-text-primary)]'>{contact.location}</p>
              </div>
            </div>
          </div>
        </Shell>

        <Shell>
          <FormManager config={formSchema as unknown as FormConfig} labels={labels} errors={errors || {}} />
        </Shell>

        <LinksPartial />
      </div>
    </>
  )
}
