/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { IsNotEmpty } from 'class-validator';
import { OtpDto } from './otp.dto';

export class OtpCheckDto extends OtpDto {
  /**
   * @example 234562
   */
  @IsNotEmpty()
  readonly code: string;
}
