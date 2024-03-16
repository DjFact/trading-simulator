/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 09:35
 */
import { LoyaltyStatusDto } from './loyalty-status.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class LoyaltyStatusCreateDto extends LoyaltyStatusDto {
  @IsNumber()
  points: number;

  @IsNumber()
  deposit: number;

  @IsNumber()
  prizeCoef: number;

  /**
   * @example 30
   * @description Inactivity in days
   */
  @IsNumber()
  expiresAfterDays: number;

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
