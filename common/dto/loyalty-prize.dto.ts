/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 09:35
 */
import { IsNumber } from 'class-validator';

export class LoyaltyPrizeDto {
  @IsNumber()
  id: number;
}
