import { Dto } from './libs/zod'
import { z } from 'zod'

export class StorageObjectDto extends Dto(
  z.object({
    file: z
      .custom<Express.Multer.File>(
        val => val && typeof val === 'object' && 'originalname' in val,
        { message: 'File is required' },
      )
      .openapi({
        type: 'string',
        format: 'binary',
      }),
  }),
) {}

export class CreateUserDto extends Dto(
  z.object({
    name: z.string(),
    role: z.string(),
    file: z.custom<Express.Multer.File>().optional().openapi({
      type: 'string',
      format: 'binary',
    }),
    fingerPrintfile: z.custom<Express.Multer.File>().optional().openapi({
      type: 'string',
      format: 'binary',
    }),
  }),
) {}

export class GetUserDto extends Dto(
  z.object({
    name: z.string().optional(),
    role: z.string().optional(),
    id: z.string().optional(),
    fingerPrintId: z.string().optional(),
  }),
) {}
