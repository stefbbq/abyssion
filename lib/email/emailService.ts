import messages from '@data/messages.json' with { type: 'json' }
import { sendEmailSendGrid } from '@lib/email/sendEmailSendGrid.ts'
import { getServerEnv } from '@lib/utils/getServerEnv.ts'

export type EmailKind = 'auditions' | 'contact'

export type EmailErrorCode = 'CONFIG_MISSING' | 'SEND_FAILED'

export type SendEmailParams = {
  kind: EmailKind
  subject: string
  text?: string
  html?: string
  replyTo?: string
}

export type SendEmailResult = { ok: true } | { ok: false; code: EmailErrorCode; message: string }

const getMessageFor = (_kind: EmailKind, code: EmailErrorCode): string => {
  const emailNode = (messages as unknown as { email?: Record<string, string> }).email
  if (emailNode && emailNode[code]) return emailNode[code]
  return 'an unknown error occurred'
}

export const sendEmail = async ({ kind, subject, text, html, replyTo }: SendEmailParams): Promise<SendEmailResult> => {
  const apiKey = getServerEnv('SENDGRID_KEY') || getServerEnv('SENDGRID_API_KEY') || ''
  const from = getServerEnv('MAIL_FROM') || ''
  const to = (getServerEnv('MAIL_TO') || '').split(',').map((s) => s.trim()).filter(Boolean)

  if (!apiKey || !from || to.length === 0) {
    console.warn(`${kind} email config missing`, { hasKey: Boolean(apiKey), hasFrom: Boolean(from), toCount: to.length })
    return { ok: false, code: 'CONFIG_MISSING', message: getMessageFor(kind, 'CONFIG_MISSING') }
  }

  try {
    await sendEmailSendGrid({ apiKey, from, to, subject, text, html, replyTo })
    return { ok: true }
  } catch (err) {
    console.error(`${kind} email send failed`, err)
    return { ok: false, code: 'SEND_FAILED', message: getMessageFor(kind, 'SEND_FAILED') }
  }
}
