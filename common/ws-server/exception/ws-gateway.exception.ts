/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17.03.2024 12:19
 */

import { WsException } from '@nestjs/websockets';
import { ExceptionCodeEnum } from '../../enum/exception-code.enum';

export class WsGatewayException extends WsException {
  constructor(
    error: string | object,
    public readonly code: ExceptionCodeEnum,
    public readonly context?: any,
  ) {
    super(error);
  }
}
