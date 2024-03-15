/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 13/03/2024 20:13
 */
import { OrderActionTypeEnum } from '../enum/order-action-type.enum';
import { OrderTypeEnum } from '../enum/order-type.enum';
import { IsEnum, IsInt, IsNumber, IsOptional, Length } from 'class-validator';

export class OrderCreateDto {
  @Length(2, 10)
  assetSymbol: string;

  @IsInt()
  quantity: number;

  @IsEnum(OrderActionTypeEnum)
  action: OrderActionTypeEnum;

  @IsEnum(OrderTypeEnum)
  orderType: OrderTypeEnum;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
