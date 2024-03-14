/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 25.03.2021 16:17
 */
import { IsEmail } from 'class-validator';

export class OtpDto {
  /**
   * @example viktorr.plotnikov@gmail.com
   */
  @IsEmail()
  readonly email: string;
}
