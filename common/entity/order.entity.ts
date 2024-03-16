/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 13/03/2024 20:13
 */
import { OrderActionTypeEnum } from '../enum/order-action-type.enum';
import { OrderTypeEnum } from '../enum/order-type.enum';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderEntity {
  @ApiProperty({
    type: String,
    description: 'Order id',
    example: 'f7b3b3e0-3e3e-4e3e-8e3e-3e3e3e3e3e3e',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Order owner id',
    example: 'f7b3b3e0-3e3e-4e3e-8e3e-3e3e3e3e3e3e',
  })
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Order asset symbol',
    example: 'AAPL',
  })
  assetSymbol: string;

  @ApiProperty({
    type: Number,
    description: 'Order quantity',
    example: 12,
  })
  quantity: number;

  @ApiProperty({ enum: OrderActionTypeEnum, description: 'Order action' })
  action: OrderActionTypeEnum;

  @ApiProperty({ enum: OrderTypeEnum, description: 'Order type' })
  orderType: OrderTypeEnum;

  @ApiPropertyOptional({
    type: Number,
    description: 'Order limit',
    example: 99.88,
  })
  limit?: number;

  @ApiProperty({
    type: Number,
    description: 'Order open price',
    example: 171.13,
  })
  openPrice: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Order close price',
    example: 171.13,
  })
  closePrice?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Order total price',
    example: 171.13,
  })
  total?: number;

  @ApiProperty({ enum: OrderStatusEnum, description: 'Order status' })
  status: OrderStatusEnum;

  @ApiPropertyOptional({
    type: String,
    description: 'Order info message',
    example: 'Insufficient funds',
  })
  info?: string;

  @ApiPropertyOptional({ type: Date, description: 'Order closed at' })
  closedAt?: Date;

  @ApiProperty({ type: Date, description: 'Order created at' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Order updated at' })
  updatedAt: Date;

  constructor(partial: Partial<any>) {
    if (!partial) {
      return;
    }
    Object.assign(this, partial.toJSON ? partial.toJSON() : partial);
  }
}
