/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { MailEnum } from '../mail.enum';
import { QueueNameEnum } from '../../../../common/enum/queue-name.enum';
import { ConfigPathDto } from '../dto/config-path.dto';
import { MailException } from '../../../../common/exception/mail.exception';
import { ExceptionCodeEnum } from '../../../../common/enum/exception-code.enum';
import urlJoin from '../../../../libs/url-join';

@Processor(QueueNameEnum.MailSender)
export class MailProcessor {
  private readonly BASE_TEMPLATE_PATH = `${MailEnum.BASE_LAYOUT}.hbs`;
  private readonly logger = new Logger(this.constructor.name);

  private get from() {
    return this.configService.get('from');
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  @OnQueueFailed()
  onError(job: Job, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(MailEnum.CREATE_ACCOUNT)
  sendCreateAccountEmail(
    job: Job<{ email: string; name: string }>,
  ): Promise<any> {
    this.logger.log(`Sending create account email to '${job.data.email}'`);

    const config: ConfigPathDto = this.configService.get('mail');
    const url = urlJoin(config.url, config.path.login);

    try {
      return this.mailerService.sendMail({
        template: this.BASE_TEMPLATE_PATH,
        context: {
          partialBody: MailEnum.CREATE_ACCOUNT,
          partialParams: {
            name: job.data.name,
            url,
          },
        },
        subject: `Creating account in ${this.configService.get('app.name')}!`,
        to: job.data.email,
        from: this.from,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send create account email to '${job.data.email}'`,
        error.stack,
      );
      throw new MailException(
        error.message,
        ExceptionCodeEnum.SendMailError,
        job.data,
      );
    }
  }

  @Process(MailEnum.OTP_PASSWORD)
  sendOtpEmail(job: Job<{ email: string; code: string }>): Promise<any> {
    this.logger.log(`Sending otp code by email to '${job.data.email}'`);

    try {
      return this.mailerService.sendMail({
        template: this.BASE_TEMPLATE_PATH,
        context: {
          partialBody: MailEnum.OTP_PASSWORD,
          partialParams: {
            code: job.data.code,
          },
        },
        subject: `Code for signIn to ${this.configService.get('app.name')}!`,
        to: job.data.email,
        from: this.from,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send otp password by email to '${job.data.email}'`,
        error.stack,
      );
      throw new MailException(
        error.message,
        ExceptionCodeEnum.SendMailError,
        job.data,
      );
    }
  }
}
