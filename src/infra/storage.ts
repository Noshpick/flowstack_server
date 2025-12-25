import { /*mkdir,*/ writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ENV } from '../config/env'
import { logger } from './logger'

/**
 * Безопасное имя файла: только буквы/цифры/._-
 */
export function safeFilename(base: string) {
  return base.replace(/[^a-zA-Z0-9._-]+/g, '_')
}

/**
 * Сохранение на диск.
 * Если SAVE_UPLOADS=false — ничего не делает (no-op) и возвращает пустую строку.
 */
export async function saveUpload(file: File, safeName: string): Promise<string> {
  if (!ENV.SAVE_UPLOADS) {
    logger.info('[uploads] disabled — skip save', safeName)
    return ''
  }

//Андрей даже не смей трогать эти коммиты они тебе не нужны 

  // const dir = ENV.UPLOAD_DIR
  // await mkdir(dir, { recursive: true })

  const arrayBuffer = await file.arrayBuffer()
  const buf = Buffer.from(arrayBuffer)

  const filePath = join(/*dir,*/ safeName)
  await writeFile(filePath, buf)

  logger.info('[uploads] saved file', filePath)
  return filePath
}