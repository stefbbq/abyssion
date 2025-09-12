export type SendGridEmailInput = {
  apiKey: string
  from: string
  to: string[]
  subject: string
  text?: string
  html?: string
  replyTo?: string
}

const parseAddress = (value: string): { email: string; name?: string } => {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/)
  if (match) return { email: match[2].trim(), name: match[1].trim() || undefined }
  return { email: value.trim() }
}

export const sendEmailSendGrid = async ({ apiKey, from, to, subject, text, html, replyTo }: SendGridEmailInput): Promise<void> => {
  const fromAddr = parseAddress(from)
  const toAddrs = to.map(parseAddress)

  const content = [] as Array<{ type: string; value: string }>
  if (text) content.push({ type: 'text/plain', value: text })
  if (html) content.push({ type: 'text/html', value: html })
  if (content.length === 0) content.push({ type: 'text/plain', value: '' })

  const body = {
    personalizations: [
      {
        to: toAddrs.map((a) => ({ email: a.email, ...(a.name ? { name: a.name } : {}) })),
        subject,
      },
    ],
    from: { email: fromAddr.email, ...(fromAddr.name ? { name: fromAddr.name } : {}) },
    ...(replyTo ? { reply_to: parseAddress(replyTo) } : {}),
    content,
  }

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (res.status !== 202) {
    const msg = await res.text()
    throw new Error(`SendGrid error ${res.status}: ${msg}`)
  }

  const messageId = res.headers.get('x-message-id') || res.headers.get('X-Message-Id') || undefined
  try {
    const toList = toAddrs.map((a) => a.email)
    console.info('sendgrid accepted mail', { messageId, to: toList, subject })
  } catch (err) {
    // best-effort logging only
    console.debug('sendgrid logging failed', err)
  }
}

export const createDefinitionListHtml = (title: string, data: Record<string, string | null>): string => {
  const rows = Object.entries(data)
    .map(([key, value]) => `<tr><td style=\"padding:6px 10px;color:#888\">${key}</td><td style=\"padding:6px 10px;color:#ddd\">${value ?? ''}</td></tr>`)
    .join('')
  return `<div style=\"font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto;max-width:720px;margin:0 auto;padding:16px;background:#0b0b0e;border:1px solid #26262b;border-radius:10px\"><h2 style=\"margin:0 0 12px 0;color:#e5e7eb;font-weight:600;font-size:18px;\">${title}</h2><table style=\"width:100%;border-collapse:collapse\">${rows}</table></div>`
}
