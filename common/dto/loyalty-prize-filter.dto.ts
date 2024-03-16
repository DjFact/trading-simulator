/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 13:51
 */
import { DateFilterDto } from './date-filter.dto';
import {
  IsISO31661Alpha2,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class LoyaltyPrizeFilterDto extends DateFilterDto {
  @IsOptional()
  @IsString()
  @Length(3, 255)
  name?: string;

  /**
   * @example executive
   */
  @IsOptional()
  @IsString()
  @Length(3, 255)
  loyalty?: string;

  @IsOptional()
  @IsISO31661Alpha2()
  country?: string;
}
