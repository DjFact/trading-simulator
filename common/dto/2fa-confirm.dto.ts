import { IsNotEmpty, IsString, Length } from 'class-validator';

const TWO_FACTOR_AUTH_CODE_LENGTH = 6;

export class TwoFactorConfirmDto {
  @Length(TWO_FACTOR_AUTH_CODE_LENGTH)
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;
}
