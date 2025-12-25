import { ENV } from '../config/env'

export const logger = {
  info: (...a: unknown[]) => console.log('[info]', ...a),
  warn: (...a: unknown[]) => console.warn('[warn]', ...a),
  error: (...a: unknown[]) => console.error('[error]', ...a),
  debug: (...a: unknown[]) => {
    if (ENV.NODE_ENV !== 'production') console.debug('[debug]', ...a)
  }
}