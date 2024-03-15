/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../../../common/entity/user.entity';

export const UserSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user || !request.user.id || !request.user.role) {
      throw new UnauthorizedException('Unauthorized by web');
    }

    return request.user;
  },
);
