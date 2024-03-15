import { Logger, Module } from '@nestjs/common';
import {
  getConfigModule,
  getThrottlerModule,
  getWinstonLoggerModule,
} from '../../../common/module.utils';
import { HealthModule } from './health/health.module';
import { GatewayAuthModule } from './auth/gateway-auth.module';
import { GatewayUserModule } from './user/gateway-user.module';
import { AllExceptionsFilter } from '../../../common/filter/all.exception.filter';
import { WsModule } from '../../../common/ws-server/ws.module';
import { GatewayBalanceModule } from './balance/gateway-balance.module';
import { GatewayOrderModule } from './order/gateway-order.module';

@Module({
  imports: [
    getConfigModule('gateway'),
    getWinstonLoggerModule(),
    getThrottlerModule(),
    GatewayAuthModule,
    GatewayUserModule,
    GatewayBalanceModule,
    GatewayOrderModule,
    WsModule,
    HealthModule,
  ],
  providers: [AllExceptionsFilter, Logger],
})
export class GatewayModule {}
