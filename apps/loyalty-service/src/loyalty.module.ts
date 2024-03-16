import { Logger, Module } from '@nestjs/common';
import { StatusModule } from './status/status.module';
import { PrizeModule } from './prize/prize.module';
import { UserStatusModule } from './user-status/user-status.module';
import { ErrorMicroserviceInterceptor } from '../../../common/interfceptor/error-microservice.interceptor';
import { MicroserviceAllExceptionFilter } from '../../../common/filter/microservice-all.exception.filter';
import {
  getConfigModule,
  getSequelizeModuleRoot,
  getThrottlerModule,
  getWinstonLoggerModule,
} from '../../../common/module.utils';
import { MicroserviceEnum } from '../../../common/enum/microservice.enum';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    getConfigModule(MicroserviceEnum.LoyaltyService),
    getSequelizeModuleRoot(),
    getWinstonLoggerModule(),
    getThrottlerModule(),
    StatusModule,
    PrizeModule,
    UserStatusModule,
    HealthModule,
  ],
  providers: [
    ErrorMicroserviceInterceptor,
    MicroserviceAllExceptionFilter,
    Logger,
  ],
})
export class LoyaltyModule {}
