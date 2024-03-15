/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { IsEmail } from 'class-validator';

export class OtpDto {
  /**
   * @example viktorr.plotnikov@gmail.com
   */
  @IsEmail()
  readonly email: string;
}
