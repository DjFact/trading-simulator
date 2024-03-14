/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 13.12.2020 10:56
 */
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { MailEnum } from './mail.enum';
import { QueueNameEnum } from '../../../common/enum/queue-name.enum';
import { UserEntity } from '../../../common/entity/user.entity';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(QueueNameEnum.MailSender) private mailQueue: Queue,
  ) {}

  /** Send email with invitation link to new user account. */
  async sendCreateAccountEmail(user: UserEntity): Promise<void> {
    await this.mailQueue.add(MailEnum.CREATE_ACCOUNT, {
      email: user.email,
      name: user.name,
    });
  }

  /** Send email with otp password. */
  async sendOtpEmail(email: string, code: string): Promise<void> {
    await this.mailQueue.add(MailEnum.OTP_PASSWORD, { email, code });
  }
}
