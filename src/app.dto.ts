import { Dto } from './libs/zod'
import { z } from 'zod'

export class StorageObjectDto extends Dto(
  z.object({
    file: z.custom<Express.Multer.File>(
        val => val && typeof val === 'object' && 'originalname' in val,
        { message: 'File is required' },
      ).openapi({
        type: 'string',
        format: 'binary',
      }),
  }),
) {}
