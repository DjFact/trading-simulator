/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 09:35
 */
import {
  IsBoolean,
  IsISO31661Alpha2,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class LoyaltyPrizeUpdateDto {
  @IsOptional()
  @IsString()
  @Length(3, 255)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 2000)
  description?: string;

  /**
   * @example executive
   */
  @IsOptional()
  @IsString()
  @Length(3, 255)
  loyalty?: string;

  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsISO31661Alpha2()
  country?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
