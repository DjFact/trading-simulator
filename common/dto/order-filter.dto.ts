/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 13:51
 */
import { DateFilterDto } from './date-filter.dto';
import { OrderStatusEnum } from '../enum/order-status.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class OrderFilterDto extends DateFilterDto {
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;
}
