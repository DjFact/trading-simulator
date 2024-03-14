/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 14/03/2024 20:59
 */
import { Logger, OnModuleInit } from '@nestjs/common';
import { BaseStrategy } from './strategy/base.strategy';
import { QueueNameEnum } from '../../common/enum/queue-name.enum';
import { StrategyFactory } from './strategy/strategy.factory';
import { MqService } from '../../common/mq/mq.service';
import { OrderTypeEnum } from '../../common/enum/order-type.enum';
import { ConsumeMessage } from 'amqplib';
import { ChannelWrapper } from 'amqp-connection-manager';
import { OrderEntity } from '../../common/entity/order.entity';
import { StrategyException } from '../../common/exception/strategy.exception';

export abstract class BaseWorkerService implements OnModuleInit {
  protected readonly strategy: BaseStrategy;

  protected constructor(
    strategyFactory: StrategyFactory,
    protected readonly mqService: MqService,
    protected readonly logger: Logger,
  ) {
    const { strategyType } = this.getWorkerConfig();
    this.strategy = strategyFactory.getStrategy(strategyType);
  }

  onModuleInit() {
    const { queueName } = this.getWorkerConfig();
    this.mqService.consumeMessages(
      queueName as string,
      this.processOrderFromQueue.bind(this),
    );
  }

  protected async processOrderFromQueue(
    msg: ConsumeMessage,
    channel: ChannelWrapper,
  ) {
    try {
      const order: OrderEntity = JSON.parse(msg.content.toString());
      /** todo: get close price from market */
      const closePrice = 100;
      await this.strategy.processOrder(order, closePrice);
    } catch (e) {
      if (e instanceof StrategyException) {
        const { queueName } = this.getWorkerConfig();
        await this.mqService.sendToQueue(
          queueName as string,
          msg.content.toString(),
        );
      } else {
        this.logger.error(e);
      }
    }

    channel.ack(msg);
  }

  protected abstract getWorkerConfig(): {
    strategyType: OrderTypeEnum;
    queueName: QueueNameEnum;
  };
}
