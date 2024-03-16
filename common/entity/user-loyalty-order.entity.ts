/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 11:53
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { LoyaltyPrizeEntity } from './loyalty-prize.entity';

export class UserLoyaltyOrderEntity {
  @ApiProperty({ type: String, description: 'Loyalty prize order id' })
  id: string;

  @ApiProperty({ type: String, description: 'Loyalty prize order user id' })
  userId: string;

  @ApiProperty({ type: String, description: 'Loyalty prize id' })
  prizeId: number;

  @ApiProperty({ type: String, description: 'Loyalty order status' })
  status: OrderStatusEnum;

  @ApiProperty({ type: Date, description: 'Loyalty order created at' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Loyalty order updated at' })
  updatedAt: Date;

  @ApiPropertyOptional({
    type: LoyaltyPrizeEntity,
    description: 'Loyalty price',
  })
  @Transform(({ value }) => (value ? new LoyaltyPrizeEntity(value) : null), {
    toClassOnly: true,
  })
  prize?: LoyaltyPrizeEntity;

  constructor(partial: Partial<any>) {
    if (!partial) {
      return;
    }
    Object.assign(this, partial.toJSON ? partial.toJSON() : partial);
  }
}
