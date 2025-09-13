import { diskStorage } from 'multer'
import { extname } from 'path'
import { v4 as uuidv4 } from 'uuid'

export function excludeSelect<
  S extends Readonly<string[]>,
  E extends S[number],
>(selectFields: S, excludeFields: E[]) {
  const subsetSet = new Set(excludeFields)
  return selectFields.filter(item => !subsetSet.has(item as any)) as Exclude<
    S[number],
    E
  >[]
}

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads', // Specify the directory where files will be stored
    filename: (_req, file, cb) => {
      console.log(file)
      const uniqueSuffix = uuidv4()
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`)
    },
  }),
}
