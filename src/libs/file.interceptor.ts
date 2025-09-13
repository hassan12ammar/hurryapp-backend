import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class FileToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()

    if (req.file) {
      req.body.file = req.file
      console.log('file found')
    }
    if (req.fingerPrintfile) {
      req.body.fingerPrintFile = req.fingerPrintFile
      console.log('fingerPrintFile found')
    }

    return next.handle()
  }
}
