/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 11:53
 */
import { ApiProperty } from '@nestjs/swagger';

export class UserLoyaltyPrizePointEntity {
  @ApiProperty({ type: Number, description: 'Loyalty prize point id' })
  id: number;

  @ApiProperty({ type: String, description: 'Loyalty prize point user id' })
  userId: string;

  @ApiProperty({ type: String, description: 'Loyalty prize point order id' })
  orderId: string;

  @ApiProperty({ type: Number, description: 'Loyalty prize points' })
  points: number;

  @ApiProperty({ type: Date, description: 'Loyalty order created at' })
  createdAt: Date;

  constructor(partial: Partial<any>) {
    if (!partial) {
      return;
    }
    Object.assign(this, partial.toJSON ? partial.toJSON() : partial);
  }
}
