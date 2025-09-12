import { Controller, Post, UseInterceptors, Body } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes } from '@nestjs/swagger'
import { StorageObjectDto } from './app.dto'
import { FileToBodyInterceptor } from './libs/file.interceptor'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('match')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'), FileToBodyInterceptor)
  match(@Body() dto: StorageObjectDto) {
    return this.appService.match(dto)
  }
}
