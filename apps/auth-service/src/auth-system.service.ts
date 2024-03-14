import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthInfoDto } from '../../../common/dto/auth-info.dto';
import { ExceptionCodeEnum } from '../../../common/enum/exception-code.enum';
import { UserService } from './user/user.service';
import { CreateUserDto } from '../../../common/dto/create-user.dto';
import { UserRoleEnum } from '../../../common/enum/user-role.enum';
import { UserException } from '../../../common/exception/user.exception';

@Injectable()
export class AuthSystemService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async createAdminUser(): Promise<AuthInfoDto> {
    const adminConfig = this.configService.get('admin');
    if (!adminConfig) {
      throw new UserException(
        'Admin configuration not found',
        ExceptionCodeEnum.UserAdminConfigNotFound,
      );
    }
    const admin = new CreateUserDto({
      ...adminConfig,
      role: UserRoleEnum.Admin,
    });

    try {
      await this.userService.create(admin);
    } catch (e) {
      if (
        e instanceof UserException &&
        e.code === ExceptionCodeEnum.UserAlreadyExists
      ) {
        return;
      }
      throw e;
    }
  }
}
