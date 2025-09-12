import { Injectable } from '@nestjs/common'
import { StorageObjectDto } from './app.dto'

@Injectable()
export class AppService {
  match(dto: StorageObjectDto) {
    console.log(dto.file)

    return {
      matching: 0.75,
    }
  }
}
