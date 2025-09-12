import {
  ArgumentsHost,
  BadGatewayException,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  HttpException,
  HttpVersionNotSupportedException,
  ImATeapotException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  PreconditionFailedException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Event } from './events'

@Catch()
export class ReqExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(e: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const event: Event<any> = ReqExceptionsFilter.processEvent(e)

    console.log(event)
    httpAdapter.reply(ctx.getResponse(), event.json(), event.statusCode)
  }

  static processEvent(e: unknown) {
    if (e instanceof Event) return e

    if (e instanceof HttpException) {
      switch (e.name) {
        case InternalServerErrorException.name:
          return new Event('SERVER', 'INTERNAL').setMeta(e.message)
        case NotFoundException.name:
          return new Event('SERVER', 'ENDPOINT_NOT_FOUND').setMeta(e.message)
        case PayloadTooLargeException.name:
          return new Event('SERVER', 'PAYLOAD_TOO_LARGE').setMeta(e.message)
        case BadGatewayException.name:
        case BadRequestException.name:
        case ConflictException.name:
        case ForbiddenException.name:
        case GatewayTimeoutException.name:
        case GoneException.name:
        case HttpVersionNotSupportedException.name:
        case ImATeapotException.name:
        case MethodNotAllowedException.name:
        case NotAcceptableException.name:
        case NotImplementedException.name:
        case PreconditionFailedException.name:
        case RequestTimeoutException.name:
        case ServiceUnavailableException.name:
        case UnauthorizedException.name:
        case UnprocessableEntityException.name:
        case UnsupportedMediaTypeException.name:
        default:
          return new Event('SERVER', 'DEBUG').setMeta(e.message)
      }
    }
    return new Event('SERVER', 'INTERNAL').setMeta(e)
  }
}
