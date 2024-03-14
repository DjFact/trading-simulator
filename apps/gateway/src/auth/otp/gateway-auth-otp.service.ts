import { Injectable } from '@nestjs/common';
import { ClientProxyService } from '../../../../../common/client-proxy/client-proxy.service';
import { AuthCommandEnum } from '../../../../../common/enum/auth-command.enum';
import { MicroserviceEnum } from '../../../../../common/enum/microservice.enum';
import { OtpDto } from '../../../../../common/dto/otp.dto';

@Injectable()
export class GatewayAuthOtpService {
  constructor(protected readonly clientProxyService: ClientProxyService) {}

  sendOtpCode(otpDto: OtpDto): void {
    this.clientProxyService.emit(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.SendOtp },
      otpDto,
    );
  }
}
