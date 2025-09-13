import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  Get,
  Query,
  UploadedFiles,
} from '@nestjs/common'
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express'
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
  @UseInterceptors(
    FileToBodyInterceptor,
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'fingerPrintfile', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  async createUser(
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[]
      fingerPrintfile?: Express.Multer.File[]
    },
    @Body() dto: CreateUserDto,
  ) {
    dto.file = files.file[0]
    dto.fingerPrintfile = files.fingerPrintfile[0]
    return this.appService.createUser(dto)
  }

  @Get('users')
  async listUsers(@Query() dto: GetUserDto) {
    return this.appService.GetUser(dto)
  }
}
