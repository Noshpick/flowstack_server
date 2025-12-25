import { ENV } from '../../config/env'

function escapeMdV2(s: string) {
  return s.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}

async function tgFetch(method: string, body: BodyInit) {
  const res = await fetch(`https://api.telegram.org/bot${ENV.BOT_TOKEN}/${method}`, {
    method: 'POST',
    body
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || (data && data.ok === false)) {
    throw new Error(`Telegram API error: ${res.status} ${JSON.stringify(data)}`)
  }
  return data
}

export async function sendApplicationMessage(payload: {
  vacancySlug: string
  vacancyTitle: string
  firstName: string
  lastName: string
  phone: string
  telegram: string
}) {

const title = escapeMdV2(payload.vacancyTitle)
const slug = escapeMdV2(payload.vacancySlug)
const first = escapeMdV2(payload.firstName)
const last = escapeMdV2(payload.lastName)
const phone = escapeMdV2(payload.phone)
const tg = escapeMdV2(payload.telegram)

  const text =
`🧩 *Новый отклик*
*Вакансия:* ${title} \\- ${slug}
*Кандидат:* ${first} ${last}
*Телефон:* ${phone}
*Telegram:* ${tg}`

  const form = new FormData()
  form.set('chat_id', ENV.ADMIN_CHAT_ID)
  form.set('text', text)
  form.set('parse_mode', 'MarkdownV2')

  await tgFetch('sendMessage', form)
}

export async function sendResumeDocument(file: File, caption?: string) {
  const form = new FormData()
  form.set('chat_id', ENV.ADMIN_CHAT_ID)
  form.set('document', file)
  if (caption) form.set('caption', caption)

  await tgFetch('sendDocument', form)
}