import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { AuthCommandEnum } from '../../../common/enum/auth-command.enum';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SignInDto } from '../../../common/dto/signin.dto';
import { TwoFactorConfirmDto } from '../../../common/dto/2fa-confirm.dto';
import { AccessTokenDto } from '../../../common/dto/access-token.dto';
import { RefreshTokenDto } from '../../../common/dto/refresh-token.dto';
import { AuthService } from './auth.service';
import { AuthInfoDto } from '../../../common/dto/auth-info.dto';
import { SignUpDto } from '../../../common/dto/signup.dto';
import { UserEntity } from '../../../common/entity/user.entity';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AuthCommandEnum.SignUp })
  signUp(
    @Payload() payload: SignUpDto & { country?: string },
  ): Promise<AuthInfoDto> {
    const { country, ...signUpDto } = payload;
    return this.authService.signUp(signUpDto, country);
  }

  @MessagePattern({ cmd: AuthCommandEnum.Authentication })
  signIn(@Payload() signInDto: SignInDto): Promise<AuthInfoDto> {
    return this.authService.signIn(signInDto);
  }

  @MessagePattern({ cmd: AuthCommandEnum.Authorization })
  verification(
    @Payload() accessTokenDto: AccessTokenDto,
  ): Promise<AuthInfoDto | UserEntity> {
    return this.authService.verifyAccessToken(accessTokenDto);
  }

  @MessagePattern({ cmd: AuthCommandEnum.TwoFactorGenerate })
  twoFactorRegister(
    @Payload() { accessToken }: Pick<AccessTokenDto, 'accessToken'>,
  ) {
    return this.authService.twoFactorRegister(accessToken);
  }

  @MessagePattern({ cmd: AuthCommandEnum.TwoFactorConfirm })
  twoFactorConfirm(@Payload() { accessToken, code }: TwoFactorConfirmDto) {
    return this.authService.twoFactorConfirm(accessToken, code);
  }

  @MessagePattern({ cmd: AuthCommandEnum.TwoFactorDisable })
  twoFactorDisable(
    @Payload() { accessToken }: Pick<AccessTokenDto, 'accessToken'>,
  ) {
    return this.authService.twoFactorDisable(accessToken);
  }

  @MessagePattern({ cmd: AuthCommandEnum.TwoFactorAuthentication })
  twoFactorAuth(@Payload() { accessToken, code }: TwoFactorConfirmDto) {
    return this.authService.twoFactorVerification(accessToken, code);
  }

  @MessagePattern({ cmd: AuthCommandEnum.RefreshToken })
  refreshAccessToken(
    @Payload() { refreshToken }: RefreshTokenDto,
  ): Promise<AuthInfoDto> {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
