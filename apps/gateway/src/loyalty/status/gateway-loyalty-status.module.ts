import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayLoyaltyStatusService } from './gateway-loyalty-status.service';
import { GatewayLoyaltyStatusController } from './gateway-loyalty-status.controller';
import { ClientProxyModule } from '../../../../../common/client-proxy/client-proxy.module';

@Module({
  imports: [ConfigModule, ClientProxyModule],
  controllers: [GatewayLoyaltyStatusController],
  providers: [GatewayLoyaltyStatusService],
})
export class GatewayLoyaltyStatusModule {}
