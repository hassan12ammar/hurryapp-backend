import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { env } from './libs/env'
import { Logger } from '@nestjs/common'
import { patchNestjsSwagger } from '@anatine/zod-nestjs'
import { ZodValidationPipe } from './libs/zod'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { writeFileSync } from 'fs'
import { apiReference } from '@scalar/nestjs-api-reference'
import { ReqExceptionsFilter } from './libs/app.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  app.useGlobalFilters(new ReqExceptionsFilter(app.get(HttpAdapterHost)))

  patchNestjsSwagger()

  let optionsBuilder = new DocumentBuilder().setTitle('fingerPrint')
  optionsBuilder = optionsBuilder.setDescription('here is the description')

  app.useGlobalPipes(new ZodValidationPipe())

  const document = SwaggerModule.createDocument(app, optionsBuilder.build())

  // write openapi.json file, for debugging
  writeFileSync('openapi.json', JSON.stringify(document, null, 2))

  app.use(
    '/docs',
    apiReference({
      spec: { content: document },
      theme: 'saturn',
      layout: 'modern',
    }),
  )

  SwaggerModule.setup('api', app, document)

  await app.listen(env.PORT, () => {
    Logger.log(
      `Application is running on: http://localhost:${env.PORT}`,
      'Bootstrap',
    )
  })
}

bootstrap()
