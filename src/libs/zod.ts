import { createZodDto, ZodDtoStatic } from "@anatine/zod-nestjs"
import {
  ZodBoolean,
  ZodDiscriminatedUnion,
  ZodNumber,
  ZodObject,
  ZodReadonly,
  ZodString,
  ZodType,
  ZodTypeAny,
} from "zod"
import { ArgumentMetadata, PipeTransform } from "@nestjs/common"
import { Event } from "./events"
import Zod from "zod"
import { extendZodWithOpenApi, OpenApiZodAny } from "@anatine/zod-openapi"
import { env } from "./env"
import { formatZodError } from "./helpers"

export function Dto<T extends OpenApiZodAny, E extends boolean = false>(
  zodSchema: T,
  excludeReadonly?: E,
): E extends true ? ZodDtoStatic<T> : ZodDtoStatic<ZodReadonly<T>> {
  const strictSchema =
    (zodSchema as unknown as ZodObject<any>).strict?.() || zodSchema
  let processedSchema = excludeReadonly
    ? strictSchema
    : (strictSchema.readonly() as unknown as ZodReadonly<T>)

  // make objects in discriminatedUnion strict
  if (processedSchema instanceof ZodDiscriminatedUnion) {
    const strictOptions = processedSchema.options.map((option: ZodTypeAny) =>
      option instanceof ZodObject ? option.strict() : option,
    )
    processedSchema = zod.discriminatedUnion(
      processedSchema.discriminator,
      strictOptions,
    ) as unknown as ZodReadonly<T>
  }

  return createZodDto(processedSchema) as E extends true
    ? ZodDtoStatic<T>
    : ZodDtoStatic<ZodReadonly<T>>
}

export class ZodValidationPipe implements PipeTransform {
  public transform(value: unknown, metadata: ArgumentMetadata): unknown {
    const zodSchema = (metadata?.metatype as ZodDtoStatic)?.zodSchema

    if (zodSchema) {
      const parseResult = zodSchema.safeParse(value)
      if (!parseResult.success) {
        const { error } = parseResult
        const message = formatZodError(error)

        throw new Event("VALIDATION", "BAD_REQUEST").setMeta(message)
      }

      return parseResult.data
    }

    return value
  }
}

extendZodWithOpenApi(Zod)
export const zod = Zod
