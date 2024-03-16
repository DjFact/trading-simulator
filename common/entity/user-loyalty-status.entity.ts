/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 11:53
 */
import { UserLoyaltyPrizePoint } from '../../apps/loyalty-service/src/model/user-loyalty-prize-point.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { LoyaltyStatusEntity } from './loyalty-status.entity';
import { UserLoyaltyOrderEntity } from './user-loyalty-order.entity';

export class UserLoyaltyStatusEntity {
  @ApiProperty({ type: String, description: 'User ID' })
  userId: string;

  @ApiProperty({
    type: String,
    description: 'User loyalty status',
    example: 'executive',
  })
  status: string;

  @ApiProperty({ type: Number, description: 'User loyalty status points' })
  points: number;

  @ApiPropertyOptional({
    type: LoyaltyStatusEntity,
    description: 'Loyalty status',
  })
  @Transform(({ value }) => (value ? new LoyaltyStatusEntity(value) : null), {
    toClassOnly: true,
  })
  loyalty?: LoyaltyStatusEntity;

  @ApiProperty({ type: Number, description: 'User loyalty prize points' })
  @Transform(({ value }) => {
    if (!value) {
      return 0;
    }
    return value.reduce(
      (acc: number, prizePoint: Partial<UserLoyaltyPrizePoint>) =>
        acc + prizePoint.points,
      0,
    );
  })
  prizePoints: number;

  @ApiPropertyOptional({
    type: UserLoyaltyOrderEntity,
    description: 'User loyalty orders',
  })
  @Transform(
    ({ value }) => {
      if (null === value) {
        return null;
      }
      return value.map((order: any) => new UserLoyaltyOrderEntity(order));
    },
    {
      toClassOnly: true,
    },
  )
  prizeOrders?: UserLoyaltyOrderEntity[];

  @ApiProperty({ type: Date, description: 'User loyalty status created at' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'User loyalty status updated at' })
  updatedAt: Date;

  constructor(partial: Partial<any>) {
    if (!partial) {
      return;
    }
    Object.assign(this, partial.toJSON ? partial.toJSON() : partial);
  }
}
