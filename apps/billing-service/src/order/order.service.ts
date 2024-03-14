/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from '../../../../common/dto/user.dto';
import { OrderCreateDto } from '../../../../common/dto/order-create.dto';
import { OrderCancelDto } from '../../../../common/dto/order-cancel.dto';
import { OrderRepository } from '../repository/order.repository';
import { OrderEntity } from '../../../../common/entity/order.entity';
import { Sequelize } from 'sequelize-typescript';
import { BillingException } from '../../../../common/exception/billing.exception';
import { ExceptionCodeEnum } from '../../../../common/enum/exception-code.enum';
import { AccountRepository } from '../repository/account.repository';
import { OrderTypeEnum } from '../../../../common/enum/order-type.enum';
import { OrderStatusEnum } from '../../../../common/enum/order-status.enum';
import { OrderActionTypeEnum } from '../../../../common/enum/order-action-type.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly accountRepository: AccountRepository,
    private readonly orderRepository: OrderRepository,
    private readonly logger: Logger,
  ) {}

  async getOrders({ userId }: UserDto): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.findAllByUserId(userId);
    if (!orders) {
      return [];
    }

    return orders.map((order) => new OrderEntity(order));
  }

  async createOrder(orderDto: OrderCreateDto): Promise<OrderEntity> {
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
    const account = await this.accountRepository.findByUserId(
      orderDto.userId,
      transaction,
    );
    if (!account) {
      throw new BillingException(
        'Account not found',
        ExceptionCodeEnum.AccountNotFound,
      );
    }
    if (orderDto.action === OrderActionTypeEnum.Buy) {
      const price =
        orderDto.orderType === OrderTypeEnum.Market
          ? openPrice
          : orderDto.limit;
      if (account.balance - account.reserved < price * orderDto.quantity) {
        throw new BillingException(
          'Insufficient funds',
          ExceptionCodeEnum.InsufficientFunds,
        );
      }
    } else {
      const holding = account.holdings.find(
        (h) => h.assetSymbol === orderDto.assetSymbol,
      );
      if (!holding) {
        throw new BillingException(
          'Holding not found',
          ExceptionCodeEnum.HoldingNotFound,
        );
      }
      if (holding.quantity < orderDto.quantity) {
        throw new BillingException(
          'Insufficient holdings',
          ExceptionCodeEnum.InsufficientFunds,
        );
      }
    }

    try {
      const promises: Promise<any>[] = [
        this.orderRepository.create(
          {
            ...orderDto,
            status: OrderStatusEnum.Open,
            openPrice,
          },
          transaction,
        ),
      ];
      if (orderDto.action === OrderActionTypeEnum.Buy) {
        promises.push(
          this.accountRepository.incrementReserved(
            orderDto.userId,
            orderDto.orderType === OrderTypeEnum.Market
              ? openPrice
              : orderDto.limit,
            transaction,
          ),
        );
      }
      const [order] = await Promise.all(promises);
      await transaction.commit();

      return new OrderEntity(order);
    } catch (e) {
      await transaction.rollback();
      this.logger.error(e);
      throw new BillingException(
        'Order not created',
        ExceptionCodeEnum.OrderCreationError,
      );
    }
  }

  async cancelOrder(orderDto: OrderCancelDto): Promise<OrderEntity> {
    const transaction = await this.sequelize.transaction();
    const order = await this.orderRepository.findById(
      orderDto.orderId,
      transaction,
    );
    if (!order || order.userId !== orderDto.userId) {
      throw new BillingException(
        'Order not found',
        ExceptionCodeEnum.OrderNotFound,
      );
    }

    if (order.status !== OrderStatusEnum.Open) {
      throw new BillingException(
        'Order already closed',
        ExceptionCodeEnum.OrderAlreadyClosed,
      );
    }

    try {
      const promises: Promise<any>[] = [
        this.orderRepository.update(
          order.id,
          { status: OrderStatusEnum.Canceled },
          transaction,
        ),
      ];
      if (order.action === OrderActionTypeEnum.Buy) {
        promises.push(
          this.accountRepository.incrementReserved(
            order.userId,
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
}
