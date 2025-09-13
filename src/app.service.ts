import { Injectable } from '@nestjs/common'
import { StorageObjectDto } from './app.dto'
import { KyselyService } from './kysely'

@Injectable()
export class AppService {
  constructor(private readonly kyselyService: KyselyService) {}

  match(dto: StorageObjectDto) {
    console.log(dto.file)

    return {
      matching: 0.75,
    }
  }

  async testDb() {
    return this.kyselyService.primary.selectFrom('users').selectAll().execute()
  }
}
