import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { getConfigModule } from '../../../common/module.utils';
import { MicroserviceEnum } from '../../../common/enum/microservice.enum';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from '../../../libs/nest-winston/winston.constants';
import { ErrorMicroserviceInterceptor } from '../../../common/interfceptor/error-microservice.interceptor';
import { MicroserviceAllExceptionFilter } from '../../../common/filter/microservice-all.exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(
    getConfigModule(MicroserviceEnum.BillingService),
  );
  const configService = context.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BillingModule,
    {
      transport: Transport.REDIS,
      options: configService.get('redis'),
    },
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalInterceptors(app.get(ErrorMicroserviceInterceptor));

  app.useGlobalFilters(app.get(MicroserviceAllExceptionFilter));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen();
  console.log(`${MicroserviceEnum.BillingService} has been started`);
}
bootstrap();
