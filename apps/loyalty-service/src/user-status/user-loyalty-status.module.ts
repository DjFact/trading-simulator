/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Logger, Module } from '@nestjs/common';
import { UserLoyaltyStatusController } from './user-loyalty-status.controller';
import { UserLoyaltyStatusService } from './user-loyalty-status.service';
import { LoyaltyPrizeRepository } from '../repository/loyalty-prize.repository';
import { UserLoyaltyStatusRepository } from '../repository/user-loyalty-status.repository';
import { UserLoyaltyPrizePointRepository } from '../repository/user-loyalty-prize-point.repository';
import { UserLoyaltyOrderRepository } from '../repository/user-loyalty-order.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoyaltyPrize } from '../model/loyalty-prize.model';
import { UserLoyaltyStatus } from '../model/user-loyalty-status.model';
import { UserLoyaltyPrizePoint } from '../model/user-loyalty-prize-point.model';
import { UserLoyaltyOrder } from '../model/user-loyalty-order.model';
import { UserLoyaltyStatusSystemService } from './user-loyalty-status-system.service';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';
import { MqModule } from '../../../../common/mq/mq.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      LoyaltyPrize,
      UserLoyaltyStatus,
      UserLoyaltyPrizePoint,
      UserLoyaltyOrder,
    ]),
    ClientProxyModule,
    MqModule,
  ],
  controllers: [UserLoyaltyStatusController],
  providers: [
    UserLoyaltyStatusService,
    LoyaltyPrizeRepository,
    UserLoyaltyStatusRepository,
    UserLoyaltyPrizePointRepository,
    UserLoyaltyOrderRepository,
    UserLoyaltyStatusSystemService,
    Logger,
  ],
})
export class UserLoyaltyStatusModule {}
