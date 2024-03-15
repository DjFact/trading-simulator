/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyService } from '../../../../common/client-proxy/client-proxy.service';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { BillingCommandEnum } from '../../../../common/enum/billing-command.enum';
import { UserDto } from '../../../../common/dto/user.dto';
import { AccountEntity } from '../../../../common/entity/balance.entity';
import { TopUpDto } from '../../../../common/dto/top-up.dto';

@Injectable()
export class GatewayBalanceService {
  constructor(protected readonly clientProxyService: ClientProxyService) {}

  getBalance(userId: string): Observable<AccountEntity> {
    return this.clientProxyService.send<AccountEntity>(
      MicroserviceEnum.BillingService,
      { cmd: BillingCommandEnum.GetBalance },
      { userId } as UserDto,
    );
  }

  topUp(userId: string, topUpDto: TopUpDto): Observable<AccountEntity> {
    return this.clientProxyService.send<AccountEntity>(
      MicroserviceEnum.AuthService,
      { cmd: BillingCommandEnum.TopUpDeposit },
      { userId, ...topUpDto },
    );
  }
}
