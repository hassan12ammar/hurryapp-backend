import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  Get,
  Query,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes } from '@nestjs/swagger'
import { CreateUserDto, GetUserDto, StorageObjectDto } from './app.dto'
import { FileToBodyInterceptor } from './libs/file.interceptor'
import { AppService } from './app.service'
import { multerConfig } from './libs/helpers'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('match')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerConfig), FileToBodyInterceptor)
  match(@Body() dto: StorageObjectDto) {
    return this.appService.match(dto)
  }

  @Post('user')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerConfig), FileToBodyInterceptor)
  async createUser(@Body() dto: CreateUserDto) {
    return this.appService.createUser(dto)
  }

  @Get('users')
  async listUsers(@Query() dto: GetUserDto) {
    return this.appService.GetUser(dto)
  }
}
