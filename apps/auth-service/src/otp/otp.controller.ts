import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { AuthCommandEnum } from '../../../../common/enum/auth-command.enum';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OtpService } from './otp.service';
import { OtpDto } from '../../../../common/dto/otp.dto';
import { OtpCheckDto } from '../../../../common/dto/otp-check.dto';
import { OtpCheckResponseDto } from '../../../../common/dto/otp-check-response.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @MessagePattern({ cmd: AuthCommandEnum.SendOtp })
  sendOtp(@Payload() payload: OtpDto): Promise<boolean> {
    return this.otpService.sendOtp(payload);
  }

  @MessagePattern({ cmd: AuthCommandEnum.CheckOtp })
  checkOtp(@Payload() payload: OtpCheckDto): Promise<OtpCheckResponseDto> {
    return this.otpService.checkOtp(payload);
  }
}
