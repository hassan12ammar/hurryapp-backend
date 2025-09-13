import { Injectable } from '@nestjs/common'
import { CreateUserDto, GetUserDto, StorageObjectDto } from './app.dto'
import { KyselyService } from './kysely'
import { env } from './libs/env'
import bcrypt from 'bcrypt'
import { ExpressionWrapper } from 'kysely'
import { DB } from './kysely/schema/types'

@Injectable()
export class AppService {
  constructor(private readonly kyselyService: KyselyService) {}

  async match(dto: StorageObjectDto) {
    console.log(dto.file)

    // get the time it took to get the match result
    const startTime = Date.now()
    // let's assume we have a matching algorithm
    await new Promise(resolve => setTimeout(resolve, 14))
    const matching = 0.75
    const endTime = Date.now()

    return {
      matching,
      fingerprintId: "80248e80-0d20-46a4-bd72-43f9be2e2a54",
      time: endTime - startTime,
    }
  }

  async createUser(dto: CreateUserDto) {
    const hash = await bcrypt.hash(dto.password, env.SALT)

    return this.kyselyService.primary
      .insertInto('users')
      .values({
        name: dto.name,
        role: dto.role,
        imagePath: dto.image.path,
        hash,
      })
      .execute()
      .catch(err => {
        throw KyselyService.proccessError(err, 'USER')
      })
  }

  async GetUser(dto: GetUserDto) {
    return this.kyselyService.primary
      .selectFrom('users')
      .select(['id', 'name', 'role', 'imagePath', 'fingerprintId'])
      .where(eb => {
        const conditions: ExpressionWrapper<DB, any, any>[] = []
        if (dto.name) conditions.push(eb('users.name', '=', dto.name))
        if (dto.role) conditions.push(eb('users.role', '=', dto.role))
        if (dto.fingerPrintId)
          conditions.push(eb('users.fingerprintId', '=', dto.fingerPrintId))

        return eb.and(conditions)
      })
      .execute()
      .catch(err => {
        throw KyselyService.proccessError(err, 'USER')
      })
  }
}
