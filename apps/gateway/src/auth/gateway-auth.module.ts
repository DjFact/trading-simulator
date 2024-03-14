import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayAuthController } from './gateway-auth.controller';
import { GatewayAuthService } from './gateway-auth.service';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';
import { getHttpModule } from '../../../../common/module.utils';
import { TwoFactorAuthService } from './2fa-auth/two-factor-auth.service';
import { GatewayAuthOtpModule } from './otp/gateway-auth-otp.module';

@Module({
  imports: [
    ConfigModule,
    ClientProxyModule,
    getHttpModule(),
    GatewayAuthOtpModule,
  ],
  controllers: [GatewayAuthController],
  providers: [GatewayAuthService, TwoFactorAuthService, Logger],
})
export class GatewayAuthModule {}
