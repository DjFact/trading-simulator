import { Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { ClientProxyService } from '../../../../../common/client-proxy/client-proxy.service';
import { TwoFactorRegistrationDto } from '../../../../../common/dto/2fa-registration.dto';
import { AuthCommandEnum } from '../../../../../common/enum/auth-command.enum';
import { MicroserviceEnum } from '../../../../../common/enum/microservice.enum';
import { TwoFactorConfirmDto } from '../../../../../common/dto/2fa-confirm.dto';
import { AuthInfoDto } from '../../../../../common/dto/auth-info.dto';
import { UserEntity } from '../../../../../common/entity/user.entity';

@Injectable()
export class TwoFactorAuthService {
  constructor(protected readonly clientProxyService: ClientProxyService) {}

  twoFactorRegister(accessToken: string): Observable<TwoFactorRegistrationDto> {
    return this.clientProxyService.send(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.TwoFactorGenerate },
      { accessToken },
    );
  }

  twoFactorConfirm(confirm: TwoFactorConfirmDto): Observable<AuthInfoDto> {
    return this.clientProxyService.send(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.TwoFactorConfirm },
      confirm,
    );
  }

  twoFactorDisable(accessToken: string): Observable<UserEntity> {
    return this.clientProxyService.send(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.TwoFactorDisable },
      { accessToken },
    );
  }

  twoFactorSignIn(creds: TwoFactorConfirmDto): Observable<AuthInfoDto> {
    return this.clientProxyService.send(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.TwoFactorAuthentication },
      creds,
    );
  }
}
