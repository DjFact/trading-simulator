/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable, Logger } from '@nestjs/common';
import { OrderCreateDto } from '../../../../common/dto/order-create.dto';
import { OrderRepository } from '../repository/order.repository';
import { OrderEntity } from '../../../../common/entity/order.entity';
import { Sequelize } from 'sequelize-typescript';
import { BillingException } from '../../../../common/exception/billing.exception';
import { ExceptionCodeEnum } from '../../../../common/enum/exception-code.enum';
import { AccountRepository } from '../repository/account.repository';
import { OrderTypeEnum } from '../../../../common/enum/order-type.enum';
import { OrderStatusEnum } from '../../../../common/enum/order-status.enum';
import { OrderActionTypeEnum } from '../../../../common/enum/order-action-type.enum';
import { Transaction } from 'sequelize';
import { AccountEntity } from '../../../../common/entity/balance.entity';
import { MqService } from '../../../../common/mq/mq.service';
import { QueueNameEnum } from '../../../../common/enum/queue-name.enum';
import { OrderFilterDto } from '../../../../common/dto/order-filter.dto';
import { TotalDataEntity } from '../../../../common/entity/total-data.entity';
import { OrderDto } from '../../../../common/dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly mqService: MqService,
    private readonly accountRepository: AccountRepository,
    private readonly orderRepository: OrderRepository,
    private readonly logger: Logger,
  ) {}

  async getOrders(
    userId: string,
    filter: OrderFilterDto,
  ): Promise<TotalDataEntity<OrderEntity[]>> {
    const { rows, count } = await this.orderRepository.findAllByUserId(
      userId,
      filter,
    );

    const data = rows.map((order) => new OrderEntity(order));
    return new TotalDataEntity(data, count);
  }

  async getAccountAndCheckFunds(
    order: Partial<OrderEntity>,
    price: number,
    transaction: Transaction,
  ): Promise<AccountEntity> {
    const account = await this.accountRepository.findByUserId(
      order.userId,
      transaction,
    );
    if (!account) {
      throw new BillingException(
        'Account not found',
        ExceptionCodeEnum.AccountNotFound,
      );
    }
    if (order.action === OrderActionTypeEnum.Buy) {
      const currentPrice =
        order.orderType === OrderTypeEnum.Market ? price : order.limit;
      if (account.balance - account.reserved < currentPrice * order.quantity) {
        throw new BillingException(
          'Insufficient funds',
          ExceptionCodeEnum.InsufficientFunds,
        );
      }
    } else {
      const holding = account.holdings.find(
        (h) => h.assetSymbol === order.assetSymbol,
      );
      if (!holding) {
        throw new BillingException(
          'Holding not found',
          ExceptionCodeEnum.HoldingNotFound,
        );
      }
      if (holding.quantity < order.quantity) {
        throw new BillingException(
          'Insufficient holdings',
          ExceptionCodeEnum.InsufficientFunds,
        );
      }
    }

    return new AccountEntity(account);
  }

  async createOrder(
    userId: string,
    orderDto: OrderCreateDto,
  ): Promise<OrderEntity> {
    if (orderDto.orderType !== OrderTypeEnum.Market && !orderDto.limit) {
      throw new BillingException(
        'Limit price not set',
        ExceptionCodeEnum.LimitPriceNotSet,
      );
    }

    /** todo: get open price from market */
    const openPrice = 100;

    const transaction = await this.sequelize.transaction();
    /** Check if account has enough funds */
    await this.getAccountAndCheckFunds(orderDto, openPrice, transaction);

    try {
      const promises: Promise<any>[] = [
        this.orderRepository.create(
          {
            ...orderDto,
            status: OrderStatusEnum.Opened,
            openPrice,
          },
          transaction,
        ),
      ];
      if (orderDto.action === OrderActionTypeEnum.Buy) {
        promises.push(
          this.accountRepository.increment(
            userId,
            null,
            orderDto.orderType === OrderTypeEnum.Market
              ? openPrice
              : orderDto.limit,
            transaction,
          ),
        );
      }
      const [order] = await Promise.all(promises);
      await transaction.commit();

      const orderEntity = new OrderEntity(order);
      await this.sendOrderToQueue(orderEntity);

      return orderEntity;
    } catch (e) {
      await transaction.rollback();
      this.logger.error(e);
      throw new BillingException(
        'Order not created',
        ExceptionCodeEnum.OrderCreationError,
      );
    }
  }

  async cancelOrder(userId: string, orderId: string): Promise<OrderEntity> {
    const transaction = await this.sequelize.transaction();
    const order = await this.orderRepository.findById(orderId, transaction);
    if (!order || order.userId !== userId) {
      throw new BillingException(
        'Order not found',
        ExceptionCodeEnum.OrderNotFound,
      );
    }

    if (order.status !== OrderStatusEnum.Opened) {
      throw new BillingException(
        'Order already closed',
        ExceptionCodeEnum.OrderAlreadyClosed,
      );
    }

    try {
      const promises: Promise<any>[] = [
        this.orderRepository.update(
          order.id,
          { status: OrderStatusEnum.Canceled, info: 'Canceled by user' },
          transaction,
        ),
      ];
      if (order.action === OrderActionTypeEnum.Buy) {
        promises.push(
          this.accountRepository.increment(
            order.userId,
            null,
            order.orderType === OrderTypeEnum.Market
              ? -order.openPrice
              : -order.limit,
            transaction,
          ),
        );
      }
      const [[cnt, [updatedOrder]]] = await Promise.all(promises);
      if (cnt === 0) {
        throw new BillingException(
          'Order not canceled',
          ExceptionCodeEnum.OrderCancelError,
        );
      }
      await transaction.commit();

      return new OrderEntity(updatedOrder);
    } catch (e) {
      await transaction.rollback();

      this.logger.error(e);
      if (e instanceof BillingException) {
        throw e;
      }
      throw new BillingException(
        'Order not canceled',
        ExceptionCodeEnum.OrderCancelError,
      );
    }
  }

  private async sendOrderToQueue(order: OrderEntity): Promise<void> {
    let queueName: QueueNameEnum;
    switch (order.orderType) {
      case OrderTypeEnum.Market:
        queueName = QueueNameEnum.MarketOrders;
        break;
      case OrderTypeEnum.Limit:
        queueName = QueueNameEnum.LimitOrders;
        break;
      case OrderTypeEnum.StopLoss:
        queueName = QueueNameEnum.StopLossOrders;
        break;
      default:
        throw new BillingException(
          'Unknown order type',
          ExceptionCodeEnum.OrderTypeUnknown,
        );
    }

    await this.mqService.sendToQueue(
      queueName as string,
      {
        orderId: order.id,
      } as OrderDto,
    );
  }
}
