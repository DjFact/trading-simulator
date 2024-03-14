/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable } from '@nestjs/common';
import { WsServer } from '../redis-adapter/redis-io.adapter';

@Injectable()
export class WsInstance {
  private server: WsServer;

  getServer(): WsServer {
    return this.server;
  }

  setServer(server: WsServer) {
    this.server = server;
  }
}
