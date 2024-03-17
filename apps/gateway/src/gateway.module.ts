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
import { GatewayLoyaltyStatusModule } from './loyalty/status/gateway-loyalty-status.module';
import { GatewayLoyaltyPrizeModule } from './loyalty/prize/gateway-loyalty-prize.module';
import { GatewayLoyaltyUserStatusModule } from './loyalty/user-status/gateway-loyalty-user-status.module';
import { SocketGatewayModule } from './websocket/socket-gateway.module';

@Module({
  imports: [
    getConfigModule('gateway'),
    getWinstonLoggerModule(),
    getThrottlerModule(),
    GatewayAuthModule,
    GatewayUserModule,
    GatewayBalanceModule,
    GatewayOrderModule,
    GatewayLoyaltyStatusModule,
    GatewayLoyaltyPrizeModule,
    GatewayLoyaltyUserStatusModule,
    SocketGatewayModule,
    WsModule,
    HealthModule,
  ],
  providers: [AllExceptionsFilter, Logger],
})
export class GatewayModule {}
