import { z } from 'zod'

export const ApplicationSchema = z.object({
  vacancySlug: z.string().min(1),
  vacancyTitle: z.string().min(1),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  // тут ожидание  маски телефона
  phone: z.string().regex(/^\+7 \(\d{3}\) \d{3} \d{2}-\d{2}$/, 'invalid phone format'),
  // telegram с @ и 5-32 символа
  telegram: z.string().regex(/^@[a-zA-Z0-9_]{5,32}$/, 'invalid telegram'),
})

export type Application = z.infer<typeof ApplicationSchema>

export const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
])