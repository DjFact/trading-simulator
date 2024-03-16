import { Logger, Module } from '@nestjs/common';
import { LoyaltyStatusModule } from './status/loyalty-status.module';
import { LoyaltyPrizeModule } from './prize/loyalty-prize.module';
import { UserLoyaltyStatusModule } from './user-status/user-loyalty-status.module';
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
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    getConfigModule(MicroserviceEnum.LoyaltyService),
    getSequelizeModuleRoot(),
    getWinstonLoggerModule(),
    getThrottlerModule(),
    ScheduleModule.forRoot(),
    LoyaltyStatusModule,
    LoyaltyPrizeModule,
    UserLoyaltyStatusModule,
    HealthModule,
  ],
  providers: [
    ErrorMicroserviceInterceptor,
    MicroserviceAllExceptionFilter,
    Logger,
  ],
})
export class LoyaltyModule {}
