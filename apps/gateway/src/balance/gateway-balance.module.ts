import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayBalanceService } from './gateway-balance.service';
import { GatewayBalanceController } from './gateway-balance.controller';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';

@Module({
  imports: [ConfigModule, ClientProxyModule],
  controllers: [GatewayBalanceController],
  providers: [GatewayBalanceService],
})
export class GatewayBalanceModule {}
