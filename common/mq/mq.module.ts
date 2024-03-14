/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 14/03/2024 14:28
 */

import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqService } from './mq.service';

@Module({
  imports: [ConfigModule],
  providers: [MqService, Logger],
  exports: [MqService],
})
export class MqModule {}
