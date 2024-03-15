/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ResponseEntity } from '../entity/response.entity';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    return next.handle().pipe(map((response) => new ResponseEntity(response)));
  }
}
