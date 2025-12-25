import { config } from 'dotenv'
import { z } from 'zod'

config()

const EnvSchema = z.object({
  BOT_TOKEN: z.string().min(1),
  ADMIN_CHAT_ID: z.string().min(1),                 // можно строкой
  SHARED_SECRET: z.string().min(1),
  ALLOWED_ORIGINS: z.string().default('*'),         // CSV: "https://site.com, http://localhost:3000"
  MAX_FILE_MB: z.coerce.number().default(10),
  PORT: z.coerce.number().default(8081),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SAVE_UPLOADS: z.coerce.boolean().default(false),  // если true — сохраним файл локально (storage.ts)
  UPLOAD_DIR: z.string().default('./uploads')       // папка для сохранения
})

export const ENV = EnvSchema.parse(process.env)