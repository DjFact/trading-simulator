/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 13/03/2024 19:04
 */
import { UserDto } from './user.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class OrderCancelDto extends UserDto {
  @IsNotEmpty()
  @IsUUID()
  orderId: string;

  constructor(userId: string, orderId: string) {
    super(userId);
    this.orderId = orderId;
  }
}
