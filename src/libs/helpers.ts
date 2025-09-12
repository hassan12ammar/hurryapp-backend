import Zod from 'zod'

export function formatZodError(error: Zod.ZodError<unknown>) {
  return error.errors
    .map(error => `${error.path.join('.')}: ${error.message}`)
    .join(', ')
}
