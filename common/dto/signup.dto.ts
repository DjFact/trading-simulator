/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  USER_NAME_MIN_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from '../const/user.const';
import { STRING_MAX_LENGTH } from '../const/general.const';

export class SignUpDto {
  public static CODE_LENGTH = 6;

  /**
   * @example viktorr.plotnikov@gmail.com
   */
  @IsEmail()
  readonly email: string;

  /**
   * @example +380979399399
   */
  @IsPhoneNumber(null)
  @Transform(({ value }) => (value ? value.replace(/[-() ]/g, '') : null))
  @IsOptional()
  readonly phone?: string;

  /**
   * @example Saver
   */
  @IsString()
  @Length(USER_NAME_MIN_LENGTH, STRING_MAX_LENGTH)
  readonly name: string;

  /**
   * @example password
   */
  @IsString()
  @Length(USER_PASSWORD_MIN_LENGTH, STRING_MAX_LENGTH)
  readonly password: string;

  /**
   * @example 086238
   */
  @Length(SignUpDto.CODE_LENGTH, SignUpDto.CODE_LENGTH)
  readonly code: string;
}
