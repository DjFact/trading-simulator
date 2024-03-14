import { Logger, Module } from '@nestjs/common';
import {
  getConfigModule,
  getSequelizeModuleRoot,
  getThrottlerModule,
  getWinstonLoggerModule,
} from '../../../common/module.utils';
import { MicroserviceEnum } from '../../../common/enum/microservice.enum';
import { HealthModule } from '../../auth-service/src/health/health.module';
import { ErrorMicroserviceInterceptor } from '../../../common/interfceptor/error-microservice.interceptor';
import { MicroserviceAllExceptionFilter } from '../../../common/filter/microservice-all.exception.filter';
import { BalanceModule } from './balance/balance.module';

@Module({
  imports: [
    getConfigModule(MicroserviceEnum.BillingService),
    getSequelizeModuleRoot(),
    getWinstonLoggerModule(),
    getThrottlerModule(),
    BalanceModule,
    HealthModule,
  ],
  providers: [
    ErrorMicroserviceInterceptor,
    MicroserviceAllExceptionFilter,
    Logger,
  ],
})
export class BillingModule {}
