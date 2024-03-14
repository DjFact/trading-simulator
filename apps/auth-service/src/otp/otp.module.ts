import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';
import { getCacheModule } from '../../../../common/module.utils';

@Module({
  imports: [ConfigModule, ClientProxyModule, getCacheModule()],
  controllers: [OtpController],
  providers: [OtpService, Logger],
  exports: [OtpService],
})
export class OtpModule {}
