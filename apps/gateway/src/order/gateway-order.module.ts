import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayOrderService } from './gateway-order.service';
import { GatewayOrderController } from './gateway-order.controller';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';

@Module({
  imports: [ConfigModule, ClientProxyModule],
  controllers: [GatewayOrderController],
  providers: [GatewayOrderService],
})
export class GatewayOrderModule {}
