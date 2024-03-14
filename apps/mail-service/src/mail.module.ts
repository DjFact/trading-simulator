/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */

import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';
import { promises as fs } from 'fs';
import * as path from 'path';
import { HealthModule } from './health/health.module';
import {
  getBullModuleRoot,
  getConfigModule,
  getThrottlerModule,
  getWinstonLoggerModule,
  registerBullQueue,
} from '../../../common/module.utils';
import { MicroserviceEnum } from '../../../common/enum/microservice.enum';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { QueueNameEnum } from '../../../common/enum/queue-name.enum';
import { MailController } from './mail.controller';
import { ErrorMicroserviceInterceptor } from '../../../common/interfceptor/error-microservice.interceptor';
import { MicroserviceAllExceptionFilter } from '../../../common/filter/microservice-all.exception.filter';
import { MailService } from './mail.service';
import { MailProcessor } from './consumer/mail.processor';

@Module({
  imports: [
    HealthModule,
    getConfigModule(MicroserviceEnum.MailService),
    getWinstonLoggerModule(),
    getThrottlerModule(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          const partialsPath = path.join(
            process.cwd(),
            configService.get('hbs.partials'),
          );

          const files = await fs.readdir(partialsPath);
          await Promise.all(
            files.map(async (fileName) => {
              const fileContent = await fs.readFile(
                path.join(partialsPath, fileName),
                'utf-8',
              );

              const partial = Handlebars.compile(fileContent);
              Handlebars.registerPartial(path.parse(fileName).name, partial);
            }),
          );
        } catch (err) {
          Logger.error('Failed register mailing partials templates:', err);
        }

        return {
          transport: {
            host: configService.get('mail.host'),
            port: configService.get('mail.port'),
            secure: configService.get<boolean>('mail.secure'),
            tls: { ciphers: 'SSLv3' }, // gmail
            auth: {
              user: configService.get('mail.user'),
              pass: configService.get('mail.pass'),
            },
          },
          defaults: {
            from: configService.get('mail.from'),
          },
          template: {
            dir: path.join(process.cwd(), configService.get('hbs.layouts')),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: false,
            },
          },
        };
      },
    }),
    getBullModuleRoot(MicroserviceEnum.MailService),
    registerBullQueue(QueueNameEnum.MailSender, 'mail.queue'),
  ],
  controllers: [MailController],
  providers: [
    Logger,
    ErrorMicroserviceInterceptor,
    MicroserviceAllExceptionFilter,
    MailService,
    MailProcessor,
  ],
})
export class MailModule {}
