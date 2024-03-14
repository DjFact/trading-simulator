import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from '../../../common/filter/all.exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from '../../../libs/nest-winston/winston.constants';
import { WsInstance } from '../../../common/ws-server/ws.instance';
import { RedisIoAdapter } from '../../../common/redis-adapter/redis-io.adapter';
import { Swagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(GatewayModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalFilters(app.get(AllExceptionsFilter));

  const configService = app.get(ConfigService);
  const wsInstance: WsInstance = app.get(WsInstance);
  app.useWebSocketAdapter(new RedisIoAdapter(app, configService, wsInstance));

  await new Swagger(app).initialize();

  await app.listen(configService.get('server.port'));

  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });

  console.log(`LoyaltyProgram Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
