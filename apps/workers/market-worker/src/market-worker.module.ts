import { Logger, Module } from '@nestjs/common';
import { MarketWorkerService } from './market-worker.service';
import {
  getBullModuleRoot,
  getConfigModule,
  getSequelizeModuleRoot,
  getWinstonLoggerModule, registerBullQueue
} from '../../../../common/module.utils';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { MqModule } from '../../../../common/mq/mq.module';
import { StrategyModule } from '../../strategy/strategy.module';
import { NOTIFY_BY_SOCKET_QUEUE } from '../../../gateway/src/websocket/processor/socket-gateway.processor';

@Module({
  imports: [
    getConfigModule(MicroserviceEnum.MarketWorker),
    getWinstonLoggerModule(),
    getSequelizeModuleRoot(),
    getBullModuleRoot(MicroserviceEnum.MarketWorker),
    registerBullQueue(NOTIFY_BY_SOCKET_QUEUE),
    ClientProxyModule,
    StrategyModule,
    MqModule,
  ],
  providers: [MarketWorkerService, Logger],
})
export class MarketWorkerModule {}
