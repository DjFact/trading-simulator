/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 09:56
 */
import { ApiProperty } from '@nestjs/swagger';
import { LoyaltyStatusEnum } from '../enum/loyalty.enum';

export class LoyaltyPrizeEntity {
  @ApiProperty({ type: Number, description: 'Loyalty prize id' })
  id: number;

  @ApiProperty({ type: String, description: 'Loyalty prize name' })
  name: string;

  @ApiProperty({ type: String, description: 'Loyalty prize description' })
  description: string;

  @ApiProperty({
    type: String,
    description: 'Loyalty status name',
    example: LoyaltyStatusEnum.Executive,
  })
  loyalty: string;

  @ApiProperty({ type: Number, description: 'Loyalty prize points' })
  points: number;

  @ApiProperty({
    type: String,
    description: 'Loyalty prize country code (ISO 3166)',
    example: 'US',
  })
  country: string;

  @ApiProperty({ type: Boolean, description: 'Loyalty prize enabled flag' })
  enabled: boolean;

  @ApiProperty({ type: Date, description: 'Loyalty prize created at' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Loyalty prize updated at' })
  updatedAt: Date;

  constructor(partial: Partial<any>) {
    if (!partial) {
      return;
    }
    Object.assign(this, partial.toJSON ? partial.toJSON() : partial);
  }
}
