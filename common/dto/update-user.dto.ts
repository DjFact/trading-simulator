import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  USER_NAME_MIN_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from '../const/user.const';

export class UpdateUserDto {
  /**
   * @example 'Viktor Plotnikov'
   */
  @IsOptional()
  @IsString()
  @MinLength(USER_NAME_MIN_LENGTH)
  readonly name?: string;

  /**
   * @example rapida88
   */
  @IsOptional()
  @IsString()
  @MinLength(USER_PASSWORD_MIN_LENGTH)
  readonly password?: string;

  /**
   * @example +380979399399
   */
  @IsPhoneNumber()
  @Transform(({ value }) => (value ? value.replace(/[-() ]/g, '') : null))
  @IsOptional()
  readonly phone?: string;

  /**
   * @example viktor,plotnikov@elkyc.com
   */
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  /**
   * @example LBSG23D2NZKGMY2QNREUCV2KPBFUMQZQGQ2WU4KCN5WGY42BNZGQ====
   */
  @IsString()
  @IsOptional()
  readonly twoFactorSecret?: string;

  @IsBoolean()
  @IsOptional()
  readonly twoFactorEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly twoFactorVerified?: boolean;
}
