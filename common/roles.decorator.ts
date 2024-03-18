/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 18.03.2024 20:43
 */

import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from './enum/user-role.enum';

export const ROLES_KEY = 'roles';

export interface RolesDecoratorData {
  enum: UserRoleEnum[];
}

export const Roles = (roles: RolesDecoratorData) =>
  SetMetadata(ROLES_KEY, roles);
