import { Injectable, Logger } from '@nestjs/common';
import { MqService } from '../../../../common/mq/mq.service';
import { QueueNameEnum } from '../../../../common/enum/queue-name.enum';
import { StrategyFactory } from '../../strategy/strategy.factory';
import { OrderTypeEnum } from '../../../../common/enum/order-type.enum';
import { BaseWorkerService } from '../../base-worker.service';
import { InjectQueue } from '@nestjs/bull';
import { NOTIFY_BY_SOCKET_QUEUE } from '../../../gateway/src/websocket/processor/socket-gateway.processor';
import { Queue } from 'bull';

@Injectable()
export class MarketWorkerService extends BaseWorkerService {
  constructor(
    @InjectQueue(NOTIFY_BY_SOCKET_QUEUE) notifyBySocketQueue: Queue,
    strategyFactory: StrategyFactory,
    mqService: MqService,
    logger: Logger,
  ) {
    super(notifyBySocketQueue, strategyFactory, mqService, logger);
  }

  protected getWorkerConfig(): {
    strategyType: OrderTypeEnum;
    queueName: QueueNameEnum;
  } {
    return {
      strategyType: OrderTypeEnum.Market,
      queueName: QueueNameEnum.MarketOrders,
    };
  }
}
