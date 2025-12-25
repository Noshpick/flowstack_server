export class AppError extends Error {
  status: number
  code?: string
  details?: unknown

  constructor(message: string, status = 400, code?: string, details?: unknown) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

export class UnauthorizedError extends AppError {
  constructor(msg = 'unauthorized') {
    super(msg, 401, 'UNAUTHORIZED')
  }
}

export class ValidationError extends AppError {
  constructor(details?: unknown) {
    super('validation error', 422, 'VALIDATION_ERROR', details)
  }
}

export class UnsupportedMediaError extends AppError {
  constructor(msg = 'unsupported media type') {
    super(msg, 415, 'UNSUPPORTED_MEDIA')
  }
}

export class TooLargeError extends AppError {
  constructor(msg = 'payload too large') {
    super(msg, 413, 'PAYLOAD_TOO_LARGE')
  }
}

export class InternalError extends AppError {
  constructor(msg = 'internal error', details?: unknown) {
    super(msg, 500, 'INTERNAL', details)
  }
}

export function toHttpError(err: unknown) {
  if (err instanceof AppError) return err
  return new InternalError('internal error', { err })
}