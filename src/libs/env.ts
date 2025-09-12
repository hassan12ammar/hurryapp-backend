import { config } from 'dotenv'
import { join } from 'path'
import { zod as z } from './zod'

config({
  path: join(process.cwd(), `.env`),
  override: true,
})

const Env = z.object({
  PORT: z.coerce.number(),
  // DATABASE_URL: z.string(),
  // PAGINATION_DEFAULT_PER_PAGE: z.coerce.number(),
  // PAGINATION_MAX_PER_PAGE: z.coerce.number(),
  TOKEN_ACCESS_SECRET: z.string(),
  TOKEN_ACCESS_EXPIRE_IN: z.coerce.number(),
  TOKEN_REFRESH_SECRET: z.string(),
  TOKEN_REFRESH_EXPIRE_IN: z.coerce.number(),
})

export const env = Env.parse(process.env)
