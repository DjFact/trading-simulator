import { Injectable } from '@nestjs/common';
import { ClientProxyService } from '../../../../common/client-proxy/client-proxy.service';
import { SignUpDto } from '../../../../common/dto/signup.dto';
import { AuthInfoDto } from '../../../../common/dto/auth-info.dto';
import { AuthCommandEnum } from '../../../../common/enum/auth-command.enum';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { SignInDto } from '../../../../common/dto/signin.dto';
import { Observable } from 'rxjs';
import { AccessTokenDto } from '../../../../common/dto/access-token.dto';
import { RefreshTokenDto } from '../../../../common/dto/refresh-token.dto';

@Injectable()
export class GatewayAuthService {
  constructor(protected readonly clientProxyService: ClientProxyService) {}

  async signUp(signUpDto: SignUpDto, country?: string): Promise<AuthInfoDto> {
    return this.clientProxyService.asyncSend<AuthInfoDto>(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.SignUp },
      { ...signUpDto, country },
    );
  }

  signIn(signInDto: SignInDto): Observable<AuthInfoDto> {
    return this.clientProxyService.send(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.Authentication },
      signInDto,
    );
  }

  accessToken(accessDto: AccessTokenDto): Observable<AuthInfoDto> {
    accessDto.renew = true;
    return this.clientProxyService.send<AuthInfoDto>(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.Authorization },
      accessDto,
    );
  }

  refreshAccessToken(refreshDto: RefreshTokenDto): Observable<AuthInfoDto> {
    return this.clientProxyService.send(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.RefreshToken },
      refreshDto,
    );
  }
}
