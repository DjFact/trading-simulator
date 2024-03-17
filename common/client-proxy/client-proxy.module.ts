import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyService } from './client-proxy.service';
import { MicroserviceEnum } from '../enum/microservice.enum';
import { getMicroserviceProvider } from '../module.utils';

@Module({
  imports: [ConfigModule],
  providers: [
    getMicroserviceProvider(MicroserviceEnum.AuthService),
    getMicroserviceProvider(MicroserviceEnum.BillingService),
    getMicroserviceProvider(MicroserviceEnum.LoyaltyService),
    getMicroserviceProvider(MicroserviceEnum.MailService),
    getMicroserviceProvider(MicroserviceEnum.TradeService),
    ClientProxyService,
  ],
  exports: [ClientProxyService],
})
export class ClientProxyModule {}
