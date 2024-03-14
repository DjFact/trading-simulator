import { Injectable, Logger } from '@nestjs/common';
import { MqService } from '../../../../common/mq/mq.service';
import { QueueNameEnum } from '../../../../common/enum/queue-name.enum';
import { StrategyFactory } from '../../strategy/strategy.factory';
import { OrderTypeEnum } from '../../../../common/enum/order-type.enum';
import { BaseWorkerService } from '../../base-worker.service';

@Injectable()
export class MarketWorkerService extends BaseWorkerService {
  constructor(
    strategyFactory: StrategyFactory,
    mqService: MqService,
    logger: Logger,
  ) {
    super(strategyFactory, mqService, logger);
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
