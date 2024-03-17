import { Logger, Module } from '@nestjs/common';
import { SocketGatewayService } from './socket-gateway.service';
import { WsAuthService } from './ws-auth.service';
import { SocketGateway } from './socket.gateway';
import { ConfigModule } from '@nestjs/config';
import {
  NOTIFY_BY_SOCKET_QUEUE,
  SocketGatewayProcessor,
} from './processor/socket-gateway.processor';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';
import { WsModule } from '../../../../common/ws-server/ws.module';
import {
  getBullModuleRoot,
  registerBullQueue,
} from '../../../../common/module.utils';

@Module({
  imports: [
    ConfigModule,
    ClientProxyModule,
    getBullModuleRoot(),
    registerBullQueue(NOTIFY_BY_SOCKET_QUEUE),
    WsModule,
  ],
  providers: [
    SocketGateway,
    SocketGatewayService,
    WsAuthService,
    SocketGatewayProcessor,
    Logger,
  ],
})
export class SocketGatewayModule {}
