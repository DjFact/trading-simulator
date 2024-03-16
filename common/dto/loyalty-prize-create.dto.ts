/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 09:35
 */
import {
  IsBoolean,
  IsISO31661Alpha2,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class LoyaltyPrizeCreateDto {
  @IsString()
  @Length(3, 255)
  name: string;

  @IsString()
  @Length(3, 2000)
  description: string;

  /**
   * @example executive
   */
  @IsString()
  @Length(3, 255)
  loyalty: string;

  @IsNumber()
  points: number;

  @IsISO31661Alpha2()
  country: string;

  @IsBoolean()
  enabled: boolean;
}
