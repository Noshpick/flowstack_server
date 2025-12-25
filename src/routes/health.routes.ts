import type { Elysia } from 'elysia'

export function registerHealthRoutes(app: Elysia) {
  app.get('/health', () => ({
    ok: true,
    service: 'fs-applications',
    ts: Date.now()
  }))
}