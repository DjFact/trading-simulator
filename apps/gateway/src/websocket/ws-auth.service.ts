/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17.03.2024 11:45
 */
import { Injectable } from '@nestjs/common';
import { SocketWithSession } from './base.gateway';
import { ClientProxyService } from '../../../../common/client-proxy/client-proxy.service';
import { WsGatewayException } from '../../../../common/ws-server/exception/ws-gateway.exception';
import { ExceptionCodeEnum } from '../../../../common/enum/exception-code.enum';
import { WsGatewayEventEnum } from '../../../../common/ws-server/enum/ws-gateway-event.enum';
import { WsNamespaceEnum } from '../../../../common/ws-server/enum/ws-namespace.enum';
import { UserEntity } from '../../../../common/entity/user.entity';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { AuthCommandEnum } from '../../../../common/enum/auth-command.enum';

@Injectable()
export class WsAuthService {
  constructor(private readonly clientProxyService: ClientProxyService) {}

  async authenticate(socket: SocketWithSession): Promise<boolean> {
    try {
      return await this.checkTokenAndTransaction(socket);
    } catch (error) {
      if (!(error instanceof WsGatewayException)) {
        error = new WsGatewayException(
          error.message,
          ExceptionCodeEnum.Unauthorized,
        );
      }

      socket.emit(WsGatewayEventEnum.Error, error);
      socket.disconnect();
      return false;
    }
  }

  private async checkTokenAndTransaction(
    socket: SocketWithSession,
  ): Promise<boolean> {
    if (socket.nsp.name !== WsNamespaceEnum.Trading) {
      throw new WsGatewayException(
        'Namespace is invalid',
        ExceptionCodeEnum.Forbidden,
      );
    }

    const accessToken = socket.handshake.auth.token;
    if (!accessToken) {
      throw new WsGatewayException(
        'Unauthorized by JWT',
        ExceptionCodeEnum.Unauthorized,
      );
    }

    try {
      socket.user = await this.clientProxyService.asyncSend<UserEntity>(
        MicroserviceEnum.AuthService,
        { cmd: AuthCommandEnum.Authorization },
        { accessToken },
      );
    } catch (err) {
      throw new WsGatewayException(
        'Current browser verification session is not active anymore',
        ExceptionCodeEnum.Unauthorized,
      );
    }

    if (!socket.user || !socket.user.id || !socket.user.email) {
      throw new WsGatewayException(
        'Unauthorized by JWT. Bad token',
        ExceptionCodeEnum.Unauthorized,
      );
    }

    return true;
  }
}
