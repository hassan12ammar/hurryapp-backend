import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { env } from './libs/env'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  })
  await app.listen(env.PORT)

  Logger.log(
    `Application is running on: http://localhost:${env.PORT}`,
    'Bootstrap',
  )
}

bootstrap()
