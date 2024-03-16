/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { GatewayUserModule } from './user/gateway-user.module';
import { GatewayAuthOtpModule } from './auth/otp/gateway-auth-otp.module';
import { GatewayAuthModule } from './auth/gateway-auth.module';
import { GatewayBalanceModule } from './balance/gateway-balance.module';
import { GatewayOrderModule } from './order/gateway-order.module';
import { GatewayLoyaltyPrizeModule } from './loyalty/prize/gateway-loyalty-prize.module';
import { GatewayLoyaltyStatusModule } from './loyalty/status/gateway-loyalty-status.module';
import { GatewayLoyaltyUserStatusModule } from './loyalty/user-status/gateway-loyalty-user-status.module';

export class Swagger {
  constructor(private app: INestApplication) {}

  async initialize(): Promise<void> {
    const optionsHealth = new DocumentBuilder()
      .setTitle('HealthCheck API')
      .build();
    const healthDoc = SwaggerModule.createDocument(this.app, optionsHealth, {
      include: [HealthModule],
    });
    SwaggerModule.setup('swagger/health', this.app, healthDoc);

    const options = new DocumentBuilder()
      .setTitle('Gateway API')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(this.app, options, {
      include: [
        GatewayUserModule,
        GatewayAuthModule,
        GatewayAuthOtpModule,
        GatewayBalanceModule,
        GatewayOrderModule,
        GatewayLoyaltyStatusModule,
        GatewayLoyaltyPrizeModule,
        GatewayLoyaltyUserStatusModule,
      ],
    });
    SwaggerModule.setup('swagger', this.app, document);
  }
}
