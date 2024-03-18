/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 18/03/2024 15:55
 */
import { Injectable } from '@nestjs/common';
import { ClientProxyService } from '../../../../common/client-proxy/client-proxy.service';
import { AuthInfoDto } from '../../../../common/dto/auth-info.dto';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { BillingCommandEnum } from '../../../../common/enum/billing-command.enum';
import { UserDto } from '../../../../common/dto/user.dto';

@Injectable()
export class UserProxy {
  constructor(private readonly clientProxyService: ClientProxyService) {}

  async createUserAccount(userId: string): Promise<void> {
    await this.clientProxyService.asyncSend<AuthInfoDto>(
      MicroserviceEnum.BillingService,
      { cmd: BillingCommandEnum.CreateAccount },
      { userId } as UserDto,
    );
  }
}
