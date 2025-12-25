import type { Elysia } from 'elysia'

export function registerHealthRoutes(app: Elysia) {
  return app
    .get('/', () => ({
      ok: true,
      service: 'fs-applications',
      ts: Date.now()
    }))
    .get('/health', () => ({
      ok: true,
      service: 'fs-applications',
      ts: Date.now()
    }))
}