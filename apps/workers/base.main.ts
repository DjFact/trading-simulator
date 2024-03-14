import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from '../../libs/nest-winston/winston.constants';

export async function bootstrap(mainModule: any, serviceName: string) {
  const app = await NestFactory.createApplicationContext(mainModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });

  console.log(`${serviceName} is running`);
}
