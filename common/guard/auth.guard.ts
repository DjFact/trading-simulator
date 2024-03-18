/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../entity/user.entity';
import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { MicroserviceEnum } from '../enum/microservice.enum';
import { AuthCommandEnum } from '../enum/auth-command.enum';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, RolesDecoratorData } from '../roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    protected readonly clientProxyService: ClientProxyService,
  ) {}

  protected async getAuthorizedUser(
    context: ExecutionContext,
  ): Promise<UserEntity> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.get('authorization');
    if (!authorization) {
      throw new UnauthorizedException('Unauthorized');
    }
    const [name, accessToken] = authorization.split(' ');
    if (name !== 'Bearer' || !accessToken) {
      throw new UnauthorizedException('Unauthorized by JWT');
    }

    return await this.clientProxyService.asyncSend<UserEntity>(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.Authorization },
      { accessToken },
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RolesDecoratorData>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();

    request.user = await this.getAuthorizedUser(context);

    if (!requiredRoles) {
      return true;
    }

    return requiredRoles.enum.some((role) => request.user.role === role);
  }
}
