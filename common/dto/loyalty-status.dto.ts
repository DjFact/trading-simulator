/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 09:35
 */
import { IsString, Length } from 'class-validator';

export class LoyaltyStatusDto {
  @IsString()
  @Length(3, 255)
  name: string;
}
