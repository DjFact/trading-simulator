/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class HoldingEntity {
  @Exclude()
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Holding asset symbol',
    example: 'AAPL',
  })
  assetSymbol: string;

  @ApiProperty({
    type: Number,
    description: 'Holding quantity',
    example: 15,
  })
  quantity: number;

  @ApiProperty({
    type: Number,
    description: 'Holding average purchase price',
    example: 127.89,
  })
  averagePurchasePrice: number;

  @ApiProperty({ type: Date, description: 'Holding created at' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Holding updated at' })
  updatedAt: Date;

  constructor(partial: Partial<any>) {
    if (!partial) {
      return;
    }
    Object.assign(this, partial.toJSON ? partial.toJSON() : partial);
  }
}
