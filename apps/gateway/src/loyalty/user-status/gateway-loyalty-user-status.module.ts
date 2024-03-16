import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayLoyaltyUserStatusService } from './gateway-loyalty-user-status.service';
import { GatewayLoyaltyUserStatusController } from './gateway-loyalty-user-status.controller';
import { ClientProxyModule } from '../../../../../common/client-proxy/client-proxy.module';

@Module({
  imports: [ConfigModule, ClientProxyModule],
  controllers: [GatewayLoyaltyUserStatusController],
  providers: [GatewayLoyaltyUserStatusService],
})
export class GatewayLoyaltyUserStatusModule {}
