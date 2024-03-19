import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseInterceptor } from '../../../../../common/interfceptor/response.interceptor';
import { ResponseErrorEntity } from '../../../../../common/entity/response-error.entity';
import { RecaptchaGuard } from '../../../../../common/recaptcha/recaptcha-guard';
import { OtpDto } from '../../../../../common/dto/otp.dto';
import { GatewayAuthOtpService } from './gateway-auth-otp.service';

@ApiTags('Authentication Gateway Service')
@ApiInternalServerErrorResponse({ type: ResponseErrorEntity, status: 500 })
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@Controller('api/auth/otp')
export class GatewayAuthOtpController {
  constructor(private readonly otpService: GatewayAuthOtpService) {}

  @ApiOperation({ summary: 'Send Otp code' })
  @UseGuards(RecaptchaGuard)
  @Post('otp')
  sendOtp(@Body() otpDto: OtpDto) {
    this.otpService.sendOtpCode(otpDto);
  }
}
