/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 14/03/2024 18:46
 */
import { IStrategy } from './strategy.interface';
import { Sequelize } from 'sequelize-typescript';
import { AccountRepository } from '../../billing-service/src/repository/account.repository';
import { OrderRepository } from '../../billing-service/src/repository/order.repository';
import { Logger } from '@nestjs/common';
import { OrderEntity } from '../../../common/entity/order.entity';
import { OrderService } from '../../billing-service/src/order/order.service';
import { HoldingRepository } from '../../billing-service/src/repository/holding.repository';
import { Transaction } from 'sequelize';
import { BillingException } from '../../../common/exception/billing.exception';
import { ExceptionCodeEnum } from '../../../common/enum/exception-code.enum';
import { OrderStatusEnum } from '../../../common/enum/order-status.enum';

export abstract class BaseStrategy implements IStrategy {
  protected constructor(
    protected readonly sequelize: Sequelize,
    protected readonly orderService: OrderService,
    protected readonly accountRepository: AccountRepository,
    protected readonly holdingRepository: HoldingRepository,
    protected readonly orderRepository: OrderRepository,
    protected readonly logger: Logger,
  ) {}

  abstract processOrder(
    order: OrderEntity,
    price: number,
    transaction: Transaction,
  ): Promise<void>;

  createTransaction(): Promise<Transaction> {
    return this.sequelize.transaction();
  }

  async getOrderById(
    orderId: string,
    transaction: Transaction,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId, transaction);
    if (!order) {
      throw new BillingException(
        'Order not found',
        ExceptionCodeEnum.OrderNotFound,
      );
    }
    if (order.status !== OrderStatusEnum.Opened) {
      throw new BillingException(
        'Order already processed',
        ExceptionCodeEnum.OrderAlreadyClosed,
      );
    }

    if (
      order.createdAt.getTime() + 1000 * 60 * 60 * 24 <
      new Date().getTime()
    ) {
      await this.orderRepository.update(
        orderId,
        { status: OrderStatusEnum.Expired },
        transaction,
      );
      await transaction.commit();

      throw new BillingException(
        'Order expired',
        ExceptionCodeEnum.OrderExpired,
      );
    }

    return new OrderEntity(order);
  }
}
