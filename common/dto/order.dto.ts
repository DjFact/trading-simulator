/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 13/03/2024 19:04
 */
import { IsNotEmpty, IsUUID } from 'class-validator';

export class OrderDto {
  @IsNotEmpty()
  @IsUUID()
  orderId: string;
}
