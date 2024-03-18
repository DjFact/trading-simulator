import { Inject, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';
import { getCacheModule } from '../../../../common/module.utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Module({
  imports: [ConfigModule, ClientProxyModule, getCacheModule()],
  controllers: [OtpController],
  providers: [OtpService, Logger],
  exports: [OtpService],
})
export class OtpModule implements OnModuleDestroy {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  onModuleDestroy() {
    (this.cacheManager.store as any).client.disconnect();
  }
}
