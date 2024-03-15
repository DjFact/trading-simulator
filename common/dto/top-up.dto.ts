/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 13/03/2024 19:04
 */
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TopUpDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
