import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayUserService } from './gateway-user.service';
import { GatewayUserController } from './gateway-user.controller';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';

@Module({
  imports: [ConfigModule, ClientProxyModule],
  controllers: [GatewayUserController],
  providers: [GatewayUserService, Logger],
})
export class GatewayUserModule {}
