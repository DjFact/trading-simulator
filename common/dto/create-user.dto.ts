import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  USER_NAME_MIN_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from '../const/user.const';
import { STRING_MAX_LENGTH } from '../const/general.const';
import { UserRoleEnum } from '../enum/user-role.enum';

export class CreateUserDto {
  /**
   * @example 'Viktor Plotnikov'
   */
  @IsNotEmpty()
  @Length(USER_NAME_MIN_LENGTH, STRING_MAX_LENGTH)
  readonly name: string;

  /**
   * @example viktor,plotnikov@elkyc.com
   */
  @IsEmail()
  readonly email: string;

  /**
   * @example password
   */
  @IsNotEmpty()
  @Length(USER_PASSWORD_MIN_LENGTH, STRING_MAX_LENGTH)
  readonly password: string;

  /**
   * @example user
   */
  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  readonly role: string;

  /**
   * @example +380979399399
   */
  @IsMobilePhone()
  @Transform(({ value }) => (value ? value.replace(/[-() ]/g, '') : null))
  @IsOptional()
  readonly phone?: string;

  /**
   * @example 'UA'
   */
  @IsOptional()
  @Length(2, 2)
  readonly country?: string;

  constructor(user: any) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.phone = user.phone;
    this.country = user.country;
  }
}
