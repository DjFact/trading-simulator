import { IsBase32, IsBase64 } from 'class-validator';

export class TwoFactorRegistrationDto {
  @IsBase64()
  qrCodeUrl: string;

  @IsBase32()
  secret: string;
}
