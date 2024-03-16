/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 09:42
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { LoyaltyStatusEnum } from '../enum/loyalty.enum';
import { LoyaltyPrizeEntity } from './loyalty-prize.entity';

export class LoyaltyStatusEntity {
  @ApiProperty({
    type: String,
    description: 'Loyalty status name',
    example: LoyaltyStatusEnum.Executive,
  })
  name: string;

  @ApiProperty({ type: Number, description: 'Loyalty status points' })
  points: number;

  @ApiProperty({ type: Number, description: 'Loyalty status deposit' })
  deposit: number;

  @ApiProperty({
    type: Number,
    description: 'Loyalty status prize coefficient',
  })
  prizeCoef: number;

  @ApiProperty({
    type: Number,
    description: 'Loyalty status expires after N days inactivity',
  })
  expiresAfterDays: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Loyalty status price points',
  })
  pricePoints?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Loyalty status trade time in seconds',
  })
  tradeTime?: number;

  @ApiProperty({ type: Date, description: 'Loyalty status created at' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Loyalty status updated at' })
  updatedAt: Date;

  @ApiPropertyOptional({
    type: [LoyaltyPrizeEntity],
    description: 'Loyalty status prizes',
  })
  @Transform(
    ({ value }) => {
      if (null === value) {
        return null;
      }
      return value.map((prize: any) => new LoyaltyPrizeEntity(prize));
    },
    {
      toClassOnly: true,
    },
  )
  prizes?: LoyaltyPrizeEntity[];

  constructor(partial: Partial<any>) {
    if (!partial) {
      return;
    }
    Object.assign(this, partial.toJSON ? partial.toJSON() : partial);
  }
}
