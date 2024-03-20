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
import { OrderDto } from '../../common/dto/order.dto';
import { ExceptionCodeEnum } from '../../common/enum/exception-code.enum';
import { instanceToPlain } from 'class-transformer';
import { Queue } from 'bull';
import { WsSocketSendEventEnum } from '../gateway/src/websocket/enum/ws-socket-send-event.enum';
import { OrderEntity } from '../../common/entity/order.entity';
import { BillingException } from '../../common/exception/billing.exception';

export abstract class BaseWorkerService implements OnModuleInit {
  protected readonly strategy: BaseStrategy;

  protected constructor(
    private readonly notifyBySocketQueue: Queue,
    strategyFactory: StrategyFactory,
    protected readonly mqService: MqService,
    protected readonly logger: Logger,
  ) {
    const { strategyType } = this.getWorkerConfig();
    this.strategy = strategyFactory.getStrategy(strategyType);
  }

  onModuleInit() {
    const { queueName } = this.getWorkerConfig();
    this.mqService.consumeMessages<OrderDto>(
      queueName as string,
      this.processOrderFromQueue.bind(this),
    );
  }

  protected async processOrderFromQueue(orderDto: OrderDto): Promise<void> {
    /** todo: get close price from market */
    const closePrice = 110;
    const transaction = await this.strategy.createTransaction();

    let processedOrder: OrderEntity;
    let isOrderProcessed = false;

    try {
      const order = await this.strategy.getOrderById(
        orderDto.orderId,
        transaction,
      );

      processedOrder = await this.strategy.processOrder(
        order,
        closePrice,
        transaction,
      );

      await transaction.commit();

      await this.mqService.sendToQueue(
        QueueNameEnum.RecalculateLoyalty,
        instanceToPlain(processedOrder),
      );
      isOrderProcessed = true;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof BillingException) {
        const cancelTransaction = await this.strategy.createTransaction();
        if (e.code === ExceptionCodeEnum.OrderExpired) {
          processedOrder = await this.strategy.expireOrder(
            orderDto.orderId,
            cancelTransaction,
          );
        } else {
          processedOrder = await this.strategy.cancelOrder(
            orderDto.orderId,
            (e?.code || e.message) as string,
            cancelTransaction,
          );
        }
        await cancelTransaction.commit();
        isOrderProcessed = true;
      } else {
        this.logger.error(e);
        const { queueName } = this.getWorkerConfig();
        await this.mqService.sendToQueue(queueName as string, orderDto);
      }
    }

    if (isOrderProcessed) {
      await this.notifyBySocketQueue.add(
        WsSocketSendEventEnum.OrderCompleted,
        instanceToPlain(processedOrder),
      );
    }
  }

  protected abstract getWorkerConfig(): {
    strategyType: OrderTypeEnum;
    queueName: QueueNameEnum;
  };
}
