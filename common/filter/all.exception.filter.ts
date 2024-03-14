import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HealthServiceUnavailableException } from '../../apps/gateway/src/health/health-service-unavailable.exception';
import { ResponseErrorEntity } from '../entity/response-error.entity';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctxHttp = host.switchToHttp();
    const request = ctxHttp.getRequest().body || null;
    const params = ctxHttp.getRequest().params || null;
    const response = ctxHttp.getResponse();

    const rpc = host.switchToRpc().getData().body || null;
    const context = { request, params, rpc };

    this.logger.error(exception, null, context);

    if (exception instanceof HealthServiceUnavailableException) {
      return response.status(exception.getStatus()).send(exception);
    }

    if (exception instanceof HttpException) {
      response
        .status(exception.getStatus())
        .json(new ResponseErrorEntity(exception.getResponse()));
    } else if (exception.code) {
      response
        .status(HttpStatus.BAD_REQUEST)
        .json(new ResponseErrorEntity(exception));
    } else {
      exception.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response
        .status(exception.statusCode)
        .json(new ResponseErrorEntity(exception));
    }
  }
}
