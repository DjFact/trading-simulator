/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17.03.2024 12:20
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, of, catchError } from 'rxjs';
import { WsGatewayException } from './exception/ws-gateway.exception';
import { WsGatewayEventEnum } from './enum/ws-gateway-event.enum';
import { ResponseEntity } from '../entity/response.entity';
import { ResponseErrorEntity } from '../entity/response-error.entity';

@Injectable()
export class WsResponseInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): any {
    return next.handle().pipe(
      map((response) => new ResponseEntity(response)),
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
      exception instanceof WsGatewayException
        ? exception
        : new WsGatewayException(
            exception.message,
            exception?.code,
            exception?.context,
          );

    this.logger.error(exception, null, sentryContext);
    socket.emit(WsGatewayEventEnum.Error, error);

    return of(new ResponseErrorEntity(error));
  }
}
