import { ExceptionCodeEnum } from '../enum/exception-code.enum';

export class StrategyException extends Error {
  constructor(
    error: string,
    public code: ExceptionCodeEnum,
    public context?: string | object,
  ) {
    super(error);
  }
}
