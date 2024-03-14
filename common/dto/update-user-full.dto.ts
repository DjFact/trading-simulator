import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

export class UpdateUserFullDto extends UpdateUserDto {
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
