/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 13/03/2024 19:04
 */
import { UserDto } from './user.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TopUpDto extends UserDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  constructor(id: string, amount: number) {
    super(id);
    this.amount = amount;
  }
}
