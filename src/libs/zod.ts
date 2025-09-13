import { createZodDto, ZodDtoStatic } from '@anatine/zod-nestjs'
import { ArgumentMetadata, PipeTransform } from '@nestjs/common'
import { Event } from './events'
import Zod from 'zod'
import { extendZodWithOpenApi, OpenApiZodAny } from '@anatine/zod-openapi'

export function Dto<T extends OpenApiZodAny>(zodSchema: T) {
  return createZodDto(zodSchema)
}

export class ZodValidationPipe implements PipeTransform {
  public transform(value: unknown, metadata: ArgumentMetadata): unknown {
    const zodSchema = (metadata?.metatype as ZodDtoStatic)?.zodSchema

    if (zodSchema) {
      const parseResult = zodSchema.safeParse(value)
      if (!parseResult.success) {
        const { error } = parseResult
        error.issues
        const message = error.issues
          .map(error => `${error.path.join('.')}: ${error.message}`)
          .join(', ')

        throw new Event('VALIDATION', 'BAD_REQUEST').setMeta(message)
      }

      return parseResult.data
    }

    return value
  }
}

extendZodWithOpenApi(Zod)
export const zod = Zod
