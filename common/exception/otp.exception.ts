import { ExceptionCodeEnum } from '../enum/exception-code.enum';
import { AuthorizationException } from './authorization.exception';

export class OtpException extends AuthorizationException {
  constructor(
    error: string | object,
    code: ExceptionCodeEnum,
    context?: string | object,
  ) {
    super(error, code, context);
  }
}
