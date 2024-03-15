/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { STRING_MAX_LENGTH } from '../const/general.const';
import { USER_PASSWORD_MIN_LENGTH } from '../const/user.const';

export class SignInDto {
  /**
   * @example viktorr.plotnikov@gmail.com
   */
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(STRING_MAX_LENGTH)
  readonly email: string;

  /**
   * @example password
   */
  @IsNotEmpty()
  @IsString()
  @Length(USER_PASSWORD_MIN_LENGTH, STRING_MAX_LENGTH)
  readonly password: string;
}
