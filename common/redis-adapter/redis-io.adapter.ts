/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { hostname } from 'os';
import { hashSync, genSaltSync } from 'bcryptjs';
import { instrument, RedisStore } from '@socket.io/admin-ui';
import { ConfigService } from '@nestjs/config';
import { ServerOptions } from 'socket.io';
import { createAdapter, RedisAdapter } from '@socket.io/redis-adapter';
import { setupWorker } from '@socket.io/sticky';
import { WsConfigInterface } from '../ws-server/interface/ws-config.interface';
import { WsAdminUiConfigInterface } from '../ws-server/interface/ws-admin-ui-config.interface';
import { WsInstance } from '../ws-server/ws.instance';
import { CommonConfigurationEnum } from '../enum/common-configuration.enum';
import { createRedisClient } from '../module.utils';
import { WsGatewayEventEnum } from '../ws-server/enum/ws-gateway-event.enum';
import { WsGatewayException } from '../ws-server/exception/ws-gateway.exception';
import { ExceptionCodeEnum } from '../enum/exception-code.enum';

export type WsServer = Server & { adapter: RedisAdapter };

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(
    readonly appOrHttpServer: INestApplicationContext,
    private readonly configService: ConfigService,
    private readonly wsInstance: WsInstance,
  ) {
    super(appOrHttpServer);
    this.initRedis();
  }

  createIOServer(port: number, options?: ServerOptions): WsServer {
    const wsConfig = this.configService.get<WsConfigInterface>(
      CommonConfigurationEnum.Ws,
    );
    const server = super.createIOServer(
      port,
      Object.assign(options, wsConfig.options),
    );
    server.adapter(this.adapterConstructor);

    if (process.env.NODE_ENV === 'production') {
      setupWorker(server);
    }

    this.wsInstance.setServer(server);
    this.denyMainConnect(server);

    this.initAdminUi(server);

    return server;
  }

  private initRedis(): void {
    const pubClient = createRedisClient(this.configService);
    const subClient = pubClient.duplicate();
    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  private denyMainConnect(server: WsServer): void {
    server.on('connection', (socket) => {
      socket.emit(
        WsGatewayEventEnum.Error,
        new WsGatewayException('Access Forbidden', ExceptionCodeEnum.Forbidden),
      );
      socket.disconnect();
    });
  }

  private initAdminUi(server: WsServer): void {
    const adminUIConfig: WsAdminUiConfigInterface = this.configService.get(
      CommonConfigurationEnum.WsAdminUI,
    );
    instrument(server, {
      auth: {
        type: 'basic',
        username: this.configService.get('SOCKET_UI_USERNAME'),
        password: hashSync(
          this.configService.get('SOCKET_UI_PASSWORD'),
          genSaltSync(10),
        ),
      },
      mode:
        process.env.NODE_ENV === 'production' ? 'production' : 'development',
      namespaceName: adminUIConfig.namespace,
      serverId: `${hostname()}#${process.pid}`,
      store: new RedisStore(createRedisClient(this.configService)),
    });
  }
}
