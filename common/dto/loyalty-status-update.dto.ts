/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 09:35
 */
import { IsNumber, IsOptional } from 'class-validator';

export class LoyaltyStatusUpdateDto {
  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsNumber()
  deposit?: number;

  @IsOptional()
  @IsNumber()
  prizeCoef?: number;

  /**
   * @example 30
   * @description Inactivity in days
   */
  @IsOptional()
  @IsNumber()
  expiresAfterDays?: number;

  @IsOptional()
  @IsNumber()
  pricePoints?: number;

  /**
   * @example 600
   * @description Trade time in seconds
   */
  @IsOptional()
  @IsNumber()
  tradeTime?: number;
}
