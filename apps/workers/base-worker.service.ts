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
import { StrategyException } from '../../common/exception/strategy.exception';
import { OrderDto } from '../../common/dto/order.dto';
import { ExceptionCodeEnum } from '../../common/enum/exception-code.enum';
import { instanceToPlain } from 'class-transformer';

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
  ): Promise<void> {
    const orderDto: OrderDto = JSON.parse(msg.content.toString());

    /** todo: get close price from market */
    const closePrice = 100;
    const transaction = await this.strategy.createTransaction();

    try {
      const order = await this.strategy.getOrderById(
        orderDto.orderId,
        transaction,
      );

      const processedOrder = await this.strategy.processOrder(
        order,
        closePrice,
        transaction,
      );

      await transaction.commit();

      await this.mqService.sendToQueue(
        QueueNameEnum.RecalculateLoyalty,
        instanceToPlain(processedOrder),
      );
    } catch (e) {
      if (e?.code !== ExceptionCodeEnum.OrderExpired) {
        await transaction.rollback();
      }

      if (e instanceof StrategyException) {
        const { queueName } = this.getWorkerConfig();
        await this.mqService.sendToQueue(queueName as string, orderDto);
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
