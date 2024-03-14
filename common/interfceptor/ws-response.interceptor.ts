/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17.03.2021 13:08
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { ResponseInterceptor } from './response.interceptor';
import { ResponseErrorEntity } from '../entity/response-error.entity';
import { Observable, of } from 'rxjs';
import { GatewayException } from '../../gateway/exception/gateway.exception';
import { GatewayEventEnum } from '../../gateway/enum/gateway-event.enum';

@Injectable()
export class WsResponseInterceptor extends ResponseInterceptor {
  constructor(private logger: Logger) {
    super();
  }

  intercept(context: ExecutionContext, next: CallHandler): any {
    const parent = super.intercept(context, next);
    return parent.pipe(
      catchError((exception) => this.catch(exception, context)),
    );
  }

  catch(
    exception: any,
    context: ExecutionContext,
  ): Observable<ResponseErrorEntity> {
    const socket = context.switchToWs().getClient();
    const sentryContext = {
      data: context.switchToWs().getData(),
      session: socket.user,
    };

    const error =
      exception instanceof GatewayException
        ? exception
        : new GatewayException(exception.message);

    if (exception?.statusCode !== 401 && error?.message !== 'jwt expired') {
      this.logger.error(exception, null, sentryContext);
    }

    socket.emit(GatewayEventEnum.Error, error);

    return of(new ResponseErrorEntity(error));
  }
}
