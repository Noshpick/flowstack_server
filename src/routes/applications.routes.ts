import type { Elysia } from 'elysia'
import { ApplicationSchema, ALLOWED_MIME } from '../shared/schema'
import { ENV } from '../config/env'
import { ValidationError, UnsupportedMediaError, TooLargeError } from '../shared/errors'
import { assertSharedSecret, rateLimit } from '../infra/security'
import { sendApplicationMessage, sendResumeDocument } from '../features/telegram/telegram'
import { saveUpload, safeFilename } from '../infra/storage'

export function registerApplicationRoutes(app: Elysia) {
  app.post('/api/v1/applications', async ({ request, set, headers }) => {
    // защита
    assertSharedSecret(request.headers)
    rateLimit(headers['x-forwarded-for']?.toString() || 'local')

    const type = request.headers.get('content-type') || ''
    if (!type.includes('multipart/form-data')) {
      throw new UnsupportedMediaError('content-type must be multipart/form-data')
    }

    const form = await request.formData()

    // honeypot
    const hp = (form.get('hp') as string) || ''
    if (hp.trim()) {
      set.status = 200
      return { ok: true }
    }

    const payload = {
      vacancySlug: String(form.get('vacancySlug') || ''),
      vacancyTitle: String(form.get('vacancyTitle') || ''),
      firstName: String(form.get('firstName') || ''),
      lastName: String(form.get('lastName') || ''),
      phone: String(form.get('phone') || ''),
      telegram: String(form.get('telegram') || '')
    }

    const parsed = ApplicationSchema.safeParse(payload)
    if (!parsed.success) {
      throw new ValidationError(parsed.error.flatten())
    }

    const resume = form.get('resume')
    if (!(resume instanceof File)) {
      throw new ValidationError({ resume: 'required' })
    }

    // проверки файла
    const sizeMb = resume.size / (1024 * 1024)
    if (sizeMb > ENV.MAX_FILE_MB) {
      throw new TooLargeError(`file too large (>${ENV.MAX_FILE_MB} MB)`)
    }
    if (resume.type && !ALLOWED_MIME.has(resume.type)) {
      throw new UnsupportedMediaError('unsupported file type')
    }

    // 1) отправляем карточку кандидата
    await sendApplicationMessage(parsed.data)

    // // 2) опционально сохраняем файл на диск (если включено)
    // if (ENV.SAVE_UPLOADS) {
    //   const name = safeFilename(
    //     `${parsed.data.lastName}_${parsed.data.firstName}_${parsed.data.vacancySlug}_${Date.now()}.` +
    //     (resume.name.split('.').pop() || 'bin')
    //   )
    //   await saveUpload(resume, name)
    // }


//Андрей даже не смей трогать второй пункт, шляпа. Но я сохранил на всякий


    // 3) отправляется документ в Telegram
    const caption = `Резюме: ${parsed.data.firstName} ${parsed.data.lastName} (${parsed.data.telegram})`
    await sendResumeDocument(resume, caption)

    return { ok: true }
  })
}