/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17.03.2024 11:34
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsAuthService } from '../ws-auth.service';
import { SocketWithSession } from '../base.gateway';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly wsAuthService: WsAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket: SocketWithSession = context.switchToWs().getClient();

    const isAuth = await this.wsAuthService.authenticate(socket);

    return isAuth && !!socket.user;
  }
}
