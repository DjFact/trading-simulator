import { RpcException } from '@nestjs/microservices';
import { ExceptionCodeEnum } from '../enum/exception-code.enum';

export class MicroserviceException extends RpcException {
  constructor(
    error: string | object,
    public readonly code: ExceptionCodeEnum,
    public readonly context?: string | object,
  ) {
    super({ error, code });
  }
}
