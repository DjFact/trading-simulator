/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17.03.2024 12:04
 */
import { ConnectedSocket, OnGatewayDisconnect } from '@nestjs/websockets';
import { OnGatewayConnection } from '@nestjs/websockets/interfaces/hooks/on-gateway-connection.interface';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SocketGatewayService } from './socket-gateway.service';
import { WsAuthService } from './ws-auth.service';
import { WsGatewayEventEnum } from '../../../../common/ws-server/enum/ws-gateway-event.enum';
import { UserEntity } from '../../../../common/entity/user.entity';

export type SocketWithSession = Socket & { user: UserEntity };

export class BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    protected readonly wsAuthService: WsAuthService,
    protected readonly gatewayService: SocketGatewayService,
    protected readonly logger: Logger,
  ) {}

  async handleConnection(@ConnectedSocket() socket: SocketWithSession) {
    this.logger.log(WsGatewayEventEnum.Connection, socket.user);
    if (!(await this.wsAuthService.authenticate(socket))) {
      return;
    }
    await this.gatewayService.handleConnection(socket);
    socket.on(WsGatewayEventEnum.Disconnecting, () =>
      this.handleDisconnecting(socket),
    );
  }

  async handleDisconnect(@ConnectedSocket() socket: SocketWithSession) {
    this.logger.log(WsGatewayEventEnum.Disconnect, socket.user);
  }

  async handleDisconnecting(@ConnectedSocket() socket: SocketWithSession) {
    this.logger.log(WsGatewayEventEnum.Disconnecting, socket.user);
  }
}
