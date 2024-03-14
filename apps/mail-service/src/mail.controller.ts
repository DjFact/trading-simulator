import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailCommandEnum } from '../../../common/enum/mail-command.enum';
import { OtpCheckDto } from '../../../common/dto/otp-check.dto';
import { UserEntity } from '../../../common/entity/user.entity';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern({ cmd: MailCommandEnum.CreateAccountEmail })
  async sendCreateAccountEmail(@Payload() payload: UserEntity): Promise<void> {
    await this.mailService.sendCreateAccountEmail(payload);
  }

  @EventPattern({ cmd: MailCommandEnum.OtpEmail })
  async sendOtpEmail(@Payload() payload: OtpCheckDto): Promise<void> {
    await this.mailService.sendOtpEmail(payload.email, payload.code);
  }
}
