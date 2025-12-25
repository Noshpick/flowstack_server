import Elysia from 'elysia'
import { corsPlugin } from '../infra/security'
import { toHttpError } from '../shared/errors'
import { logger } from '../infra/logger'
import { registerHealthRoutes } from '../routes/health.routes'
import { registerApplicationRoutes } from '../routes/applications.routes'

export function buildApp() {
  const app = new Elysia()
    .use(corsPlugin)
    .onError(({ code, error, set, request }) => {
      const httpErr = toHttpError(error)
      set.status = httpErr.status
      const url = request.url
      logger.error(code, httpErr.status, httpErr.code, httpErr.message, url, httpErr.details)
      return {
        error: httpErr.message,
        code: httpErr.code,
        details: httpErr.details
      }
    })

  registerHealthRoutes(app)
  registerApplicationRoutes(app)

  return app
}