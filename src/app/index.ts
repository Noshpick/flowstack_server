import { buildApp } from './app'
import { ENV } from '../config/env'
import { logger } from '../infra/logger'

const app = buildApp()
app.listen(ENV.PORT)
logger.info(`[server] listening on http://0.0.0.0:${ENV.PORT}`)