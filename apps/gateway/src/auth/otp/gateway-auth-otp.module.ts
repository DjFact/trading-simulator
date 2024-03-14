import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyModule } from '../../../../../common/client-proxy/client-proxy.module';
import { GatewayAuthOtpController } from './gateway-auth-otp.controller';
import { GatewayAuthOtpService } from './gateway-auth-otp.service';
import { getHttpModule } from '../../../../../common/module.utils';

@Module({
  imports: [ConfigModule, ClientProxyModule, getHttpModule()],
  controllers: [GatewayAuthOtpController],
  providers: [GatewayAuthOtpService, Logger],
})
export class GatewayAuthOtpModule {}
