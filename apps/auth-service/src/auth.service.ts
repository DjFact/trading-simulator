import qrcode from 'qrcode';
import { authenticator } from 'otplib';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../../../common/dto/signin.dto';
import { AuthInfoDto } from '../../../common/dto/auth-info.dto';
import { TwoFactorRegistrationDto } from '../../../common/dto/2fa-registration.dto';
import { ExceptionCodeEnum } from '../../../common/enum/exception-code.enum';
import { AuthorizationException } from '../../../common/exception/authorization.exception';
import { SignUpDto } from '../../../common/dto/signup.dto';
import { UserEntity } from '../../../common/entity/user.entity';
import { AccessTokenDto } from '../../../common/dto/access-token.dto';
import { UserService } from './user/user.service';
import { OtpCheckDto } from '../../../common/dto/otp-check.dto';
import { OtpService } from './otp/otp.service';
import { UserRoleEnum } from '../../../common/enum/user-role.enum';

@Injectable()
export class AuthService {
  private readonly appName2FA: string;
  private readonly refreshExpiresIn: string;

  constructor(
    configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {
    this.appName2FA = configService.get('2fa_auth.appName');
    this.refreshExpiresIn = configService.get('jwt.refreshExpiresIn');
  }

  async signIn(signInDto: SignInDto): Promise<AuthInfoDto> {
    const user: UserEntity =
      await this.userService.findByLoginAndPassword(signInDto);

    return this.getAuthInfoDto(user);
  }

  async signUp(signUpDto: SignUpDto, country?: string): Promise<AuthInfoDto> {
    const { code, ...createDto } = signUpDto;
    const otpRequest: OtpCheckDto = { email: createDto.email, code };

    await this.otpService.checkOtp(otpRequest);

    const user: UserEntity = await this.userService.create({
      ...signUpDto,
      role: UserRoleEnum.User,
      country,
    });

    return this.getAuthInfoDto(user);
  }

  async twoFactorRegister(
    accessToken: string,
  ): Promise<TwoFactorRegistrationDto> {
    const jwtData = this.jwtService.verify(accessToken);
    const user: UserEntity = await this.userService.getById(jwtData.id);
    if (!user) {
      throw new AuthorizationException(
        'Invalid access token',
        ExceptionCodeEnum.AuthError,
        {
          id: jwtData.id,
        },
      );
    }

    if (user.twoFactorVerified) {
      throw new AuthorizationException(
        'Two factor verification already verified',
        ExceptionCodeEnum.AlreadyVerified,
        user,
      );
    }

    const { secret, qrCodeUrl } = await this.twoFactorGenerate(user.name);
    const updates = {
      twoFactorSecret: secret,
    };

    await this.userService.updateById(jwtData.id, updates);

    return { qrCodeUrl, secret };
  }

  async twoFactorConfirm(
    accessToken: string,
    code: string,
  ): Promise<AuthInfoDto> {
    const user = await this.getUserByToken(accessToken);
    const authPayload = this.verifyTwoFactorCode(user, code);

    const updates = {
      twoFactorVerified: true,
      twoFactorEnabled: true,
    };

    await this.userService.updateById(user.id, updates);

    return authPayload;
  }

  async twoFactorDisable(accessToken: string): Promise<UserEntity> {
    const user = await this.getUserByToken(accessToken);
    const updates = {
      twoFactorVerified: false,
      twoFactorEnabled: false,
      twoFactorSecret: null,
    };

    return this.userService.updateById(user.id, updates);
  }

  async twoFactorVerification(
    accessToken: string,
    code: string,
  ): Promise<AuthInfoDto> {
    const user = await this.getUserByToken(accessToken);

    if (!user.twoFactorVerified) {
      throw new AuthorizationException(
        'Unable to verify code, please complete two factor registration',
        ExceptionCodeEnum.TwoFactorVerificationNeeded,
        user,
      );
    }

    return this.verifyTwoFactorCode(user, code);
  }

  async verifyAccessToken(
    accessTokenDto: AccessTokenDto,
  ): Promise<AuthInfoDto | UserEntity> {
    /** verify jwt token */
    let jwtData: UserEntity & { twoFactorCompleted?: boolean };
    try {
      jwtData = this.jwtService.verify(accessTokenDto.accessToken);
    } catch (err) {
      throw new AuthorizationException(
        err.message,
        ExceptionCodeEnum.AuthError,
      );
    }

    if (jwtData.twoFactorEnabled && !jwtData.twoFactorCompleted) {
      throw new AuthorizationException(
        'Two factor verification was not completed',
        ExceptionCodeEnum.TwoFactorVerificationNeeded,
      );
    }

    const user = await this.userService.getById(jwtData.id);
    if (!user) {
      throw new AuthorizationException(
        'User not found',
        ExceptionCodeEnum.UserNotFound,
      );
    }

    return accessTokenDto.renew
      ? this.getAuthInfoDto(user, jwtData.twoFactorCompleted)
      : user;
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthInfoDto> {
    let jwtData: UserEntity;

    try {
      jwtData = this.jwtService.verify(refreshToken);
    } catch (err) {
      throw new AuthorizationException(
        err.message,
        ExceptionCodeEnum.AuthError,
      );
    }

    const user = await this.userService.getById(jwtData.id);
    if (!user) {
      throw new AuthorizationException(
        'User not found',
        ExceptionCodeEnum.UserNotFound,
        user,
      );
    }

    return this.getAuthInfoDto(user);
  }

  private async twoFactorGenerate(
    account: string,
  ): Promise<TwoFactorRegistrationDto> {
    const secret = authenticator.generateSecret();
    const otpAuth = authenticator.keyuri(account, this.appName2FA, secret);

    const qrCodeUrl = await qrcode.toDataURL(otpAuth);

    return { secret, qrCodeUrl };
  }

  private generateTwoFactorAccessToken(
    userPayload: UserEntity,
    twoFactorCompleted?: boolean,
  ): string {
    return this.jwtService.sign({ ...userPayload, twoFactorCompleted });
  }

  private async getUserByToken(accessToken: string): Promise<UserEntity> {
    let jwtData: UserEntity;
    try {
      jwtData = this.jwtService.verify(accessToken);
    } catch (err) {
      throw new AuthorizationException(
        `Jwt verification failed with error ${err.message}`,
        ExceptionCodeEnum.AuthError,
        {
          accessToken,
        },
      );
    }

    return this.userService.getById(jwtData.id);
  }

  private verifyTwoFactorCode(user: UserEntity, code: string): AuthInfoDto {
    if (!user.twoFactorSecret) {
      throw new AuthorizationException(
        `Unable to verify code, please process two factor auth`,
        ExceptionCodeEnum.AuthError,
        user,
      );
    }

    const isValid = authenticator.check(code, user.twoFactorSecret);

    if (!isValid) {
      throw new AuthorizationException(
        'Invalid two factor verification code',
        ExceptionCodeEnum.AuthError,
        user,
      );
    }

    return this.getAuthInfoDto(user, true);
  }

  private getAuthInfoDto(
    user: UserEntity,
    twoFactorCompleted?: boolean,
  ): AuthInfoDto {
    const accessToken = this.generateTwoFactorAccessToken(
      user,
      twoFactorCompleted,
    );

    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: this.refreshExpiresIn },
    );

    return new AuthInfoDto(user, accessToken, refreshToken);
  }
}
