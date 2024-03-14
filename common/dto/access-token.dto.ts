/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AccessTokenDto {
  @IsString()
  readonly accessToken: string;

  @IsBoolean()
  @IsOptional()
  renew?: boolean;
}
