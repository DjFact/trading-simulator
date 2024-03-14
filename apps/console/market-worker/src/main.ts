import { NestFactory } from '@nestjs/core';
import { Console/marketWorkerModule } from './console/market-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(Console/marketWorkerModule);
  await app.listen(3000);
}
bootstrap();
