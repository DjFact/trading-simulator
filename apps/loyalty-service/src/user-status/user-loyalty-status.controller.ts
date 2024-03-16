/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { LoyaltyCommandEnum } from '../../../../common/enum/loyalty-command.enum';
import { UserLoyaltyStatusService } from './user-loyalty-status.service';
import { UserDto } from '../../../../common/dto/user.dto';
import { LoyaltyPrizeDto } from '../../../../common/dto/loyalty-prize.dto';
import { UserLoyaltyStatusEntity } from '../../../../common/entity/user-loyalty-status.entity';
import { UserLoyaltyOrderEntity } from '../../../../common/entity/user-loyalty-order.entity';
import { OrderEntity } from '../../../../common/entity/order.entity';

@Controller()
export class UserLoyaltyStatusController {
  constructor(private readonly userStatusService: UserLoyaltyStatusService) {}

  @MessagePattern({ cmd: LoyaltyCommandEnum.GetUserStatus })
  getStatus(@Payload() { userId }: UserDto): Promise<UserLoyaltyStatusEntity> {
    return this.userStatusService.getStatus(userId);
  }

  @EventPattern({ cmd: LoyaltyCommandEnum.RecalculateUserStatus })
  async recalculateUserStatus(
    @Payload() { userId, ...order }: UserDto & Partial<OrderEntity>,
  ): Promise<void> {
    await this.userStatusService.recalculateStatus(userId, order);
  }

  @MessagePattern({ cmd: LoyaltyCommandEnum.MakePrizeOrder })
  makePrizeOrder(
    @Payload() prizeOrder: UserDto & LoyaltyPrizeDto & { country: string },
  ): Promise<UserLoyaltyOrderEntity> {
    return this.userStatusService.makePrizeOrder(
      prizeOrder.userId,
      prizeOrder.id,
      prizeOrder.country,
    );
  }
}
