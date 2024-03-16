import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayLoyaltyPrizeService } from './gateway-loyalty-prize.service';
import { GatewayLoyaltyPrizeController } from './gateway-loyalty-prize.controller';
import { ClientProxyModule } from '../../../../../common/client-proxy/client-proxy.module';

@Module({
  imports: [ConfigModule, ClientProxyModule],
  controllers: [GatewayLoyaltyPrizeController],
  providers: [GatewayLoyaltyPrizeService],
})
export class GatewayLoyaltyPrizeModule {}
