import {
  Catch,
  ExceptionFilter,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { BaseError, ValidationError } from 'sequelize';
import { Observable, throwError } from 'rxjs';

@Catch()
@Injectable()
export class MicroserviceAllExceptionFilter implements ExceptionFilter {
  catch(exception: any): Observable<any> {
    // healthCheck case
    if (exception instanceof ServiceUnavailableException) {
      return throwError(() => exception);
    }

    if (!(exception instanceof RpcException)) {
      let error = exception.error;

      if (exception instanceof ValidationError) {
        error = exception.errors.map((err) => err.message).join(',');
        return throwError(() => new RpcException(error));
      }

      if (exception instanceof BaseError) {
        return throwError(() => new RpcException(exception.message));
      }

      if (exception.getError) {
        return throwError(() => new RpcException(exception.getError()));
      }

      if (exception.errors) {
        error = exception.errors.map((err) => err.message).join(',');
        return throwError(() => new RpcException(error));
      }

      if (exception.getResponse) {
        error = exception.getResponse().message
          ? exception.getResponse().message
          : exception.message;
        if (Array.isArray(error)) {
          error = error.join(',');
        }
      }

      return throwError(() => new RpcException(error));
    }

    return throwError(() => exception);
  }
}
