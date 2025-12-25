import { cors } from '@elysiajs/cors'
import type { Elysia } from 'elysia'
import { ENV } from '../config/env'
import { UnauthorizedError } from '../shared/errors'

// CORS
export const corsPlugin = cors({
  origin: ENV.ALLOWED_ORIGINS === '*'
    ? true
    : ENV.ALLOWED_ORIGINS.split(',').map(x => x.trim()),
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-shared-secret']
})

// простая проверка общего секрета
export function assertSharedSecret(headers: Headers) {
  const got = headers.get('x-shared-secret')
  if (!got || got !== ENV.SHARED_SECRET) {
    throw new UnauthorizedError()
  }
}

// очень простой rate-limit в памяти по IP (best-effort)
const windowMs = 60_000
const maxRequests = 30
const bucket = new Map<string, { count: number; ts: number }>()

export function rateLimit(ip: string) {
  const now = Date.now()
  const rec = bucket.get(ip)
  if (!rec || now - rec.ts > windowMs) {
    bucket.set(ip, { count: 1, ts: now })
    return
  }
  rec.count += 1
  if (rec.count > maxRequests) {
    throw new Error('too many requests')
  }
}