/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17.03.2024 12:04
 */
import { Injectable } from '@nestjs/common';
import { SocketWithSession } from './base.gateway';
import { ClientProxyService } from '../../../../common/client-proxy/client-proxy.service';
import { UserLoyaltyStatusEntity } from '../../../../common/entity/user-loyalty-status.entity';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { LoyaltyCommandEnum } from '../../../../common/enum/loyalty-command.enum';
import { Observable } from 'rxjs';
import { UserLoyaltyOrderEntity } from '../../../../common/entity/user-loyalty-order.entity';

@Injectable()
export class SocketGatewayService {
  constructor(private readonly clientProxyService: ClientProxyService) {}

  async handleConnection(socket: SocketWithSession): Promise<void> {
    socket.join(socket.user.id);
  }

  getLoyaltyStatus(userId: string): Observable<UserLoyaltyStatusEntity> {
    return this.clientProxyService.send<UserLoyaltyStatusEntity>(
      MicroserviceEnum.LoyaltyService,
      { cmd: LoyaltyCommandEnum.GetUserStatus },
      { userId },
    );
  }

  createLoyaltyPrizeOrder(
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
