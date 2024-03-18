import { NestFactory } from '@nestjs/core';
import { LoyaltyModule } from './loyalty.module';
import { getConfigModule, getRedisOptions } from '../../../common/module.utils';
import { MicroserviceEnum } from '../../../common/enum/microservice.enum';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from '../../../libs/nest-winston/winston.constants';
import { ErrorMicroserviceInterceptor } from '../../../common/interfceptor/error-microservice.interceptor';
import { MicroserviceAllExceptionFilter } from '../../../common/filter/microservice-all.exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(
    getConfigModule(MicroserviceEnum.LoyaltyService),
  );
  const configService = context.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    LoyaltyModule,
    {
      transport: Transport.REDIS,
      options: getRedisOptions(configService),
    },
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalInterceptors(app.get(ErrorMicroserviceInterceptor));

  app.useGlobalFilters(app.get(MicroserviceAllExceptionFilter));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen();
  console.log(`${MicroserviceEnum.LoyaltyService} has been started`);
}
bootstrap();
