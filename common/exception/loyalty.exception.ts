import { MicroserviceException } from './microservice.exception';
import { ExceptionCodeEnum } from '../enum/exception-code.enum';

export class LoyaltyException extends MicroserviceException {
  constructor(
    error: string | object,
    code: ExceptionCodeEnum,
    context?: string | object,
  ) {
    super(error, code, context);
  }
}
