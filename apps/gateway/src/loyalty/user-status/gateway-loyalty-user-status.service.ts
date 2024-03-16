/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyService } from '../../../../../common/client-proxy/client-proxy.service';
import { MicroserviceEnum } from '../../../../../common/enum/microservice.enum';
import { LoyaltyCommandEnum } from '../../../../../common/enum/loyalty-command.enum';
import { UserLoyaltyOrderEntity } from '../../../../../common/entity/user-loyalty-order.entity';
import { UserLoyaltyStatusEntity } from '../../../../../common/entity/user-loyalty-status.entity';

@Injectable()
export class GatewayLoyaltyUserStatusService {
  constructor(protected readonly clientProxyService: ClientProxyService) {}

  getStatus(userId: string): Observable<UserLoyaltyStatusEntity> {
    return this.clientProxyService.send<UserLoyaltyStatusEntity>(
      MicroserviceEnum.LoyaltyService,
      { cmd: LoyaltyCommandEnum.GetUserStatus },
      { userId },
    );
  }

  makePrizeOrder(
    userId: string,
    prizeId: number,
    country: string,
  ): Observable<UserLoyaltyOrderEntity> {
    return this.clientProxyService.send<UserLoyaltyOrderEntity>(
      MicroserviceEnum.LoyaltyService,
      { cmd: LoyaltyCommandEnum.MakePrizeOrder },
      { userId, id: prizeId, country },
    );
  }
}
