/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 14/03/2024 18:47
 */
import { IStrategy } from './strategy.interface';
import { BaseStrategy } from './base.strategy';
import { Injectable, Logger } from '@nestjs/common';
import { OrderEntity } from '../../../common/entity/order.entity';
import { OrderActionTypeEnum } from '../../../common/enum/order-action-type.enum';
import { OrderStatusEnum } from '../../../common/enum/order-status.enum';
import { HoldingEntity } from '../../../common/entity/holding.entity';
import { StrategyException } from '../../../common/exception/strategy.exception';
import { ExceptionCodeEnum } from '../../../common/enum/exception-code.enum';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { OrderService } from '../../billing-service/src/order/order.service';
import { AccountRepository } from '../../billing-service/src/repository/account.repository';
import { HoldingRepository } from '../../billing-service/src/repository/holding.repository';
import { OrderRepository } from '../../billing-service/src/repository/order.repository';
import { toFixed2Number } from '../../../common/numbers.helper';

@Injectable()
export class MarketStrategy extends BaseStrategy implements IStrategy {
  constructor(
    sequelize: Sequelize,
    orderService: OrderService,
    accountRepository: AccountRepository,
    holdingRepository: HoldingRepository,
    orderRepository: OrderRepository,
    logger: Logger,
  ) {
    super(
      sequelize,
      orderService,
      accountRepository,
      holdingRepository,
      orderRepository,
      logger,
    );
  }

  async processOrder(
    order: OrderEntity,
    closePrice: number,
    transaction: Transaction,
  ): Promise<OrderEntity> {
    /** Check if account has enough funds */
    const account = await this.orderService.getAccountAndCheckFunds(
      order,
      closePrice,
      transaction,
    );
    const holding: HoldingEntity | undefined = account.holdings.find(
      (h) => h.assetSymbol === order.assetSymbol,
    );

    const total = toFixed2Number(closePrice * order.quantity);
    try {
      let promises: Promise<any>[];
      if (order.action === OrderActionTypeEnum.Buy) {
        promises = this.processBuyOrder(
          order,
          holding,
          closePrice,
          total,
          transaction,
        );
      } else {
        promises = this.processSellOrder(order, holding, total, transaction);
      }

      promises.unshift(
        this.orderRepository.update(
          order.id,
          {
            status: OrderStatusEnum.Closed,
            closePrice,
            closedAt: new Date(),
            total,
          },
          transaction,
        ),
      );

      const [updatedOrder] = await Promise.all(promises);
      return new OrderEntity(updatedOrder);
    } catch (e) {
      this.logger.error(e, order);

      throw new StrategyException(
        'Error processing order',
        ExceptionCodeEnum.StrategyProcessingError,
      );
    }
  }

  private processBuyOrder(
    order: OrderEntity,
    holding: HoldingEntity,
    closePrice: number,
    total: number,
    transaction: Transaction,
  ): Promise<any>[] {
    const promises: Promise<any>[] = [];
    let averagePrice = closePrice;
    /** Calculate average price */
    if (holding) {
      averagePrice =
        Math.round(
          ((holding.averagePrice * holding.quantity +
            closePrice * order.quantity) /
            (holding.quantity + order.quantity)) *
            100,
        ) / 100;
    }
    promises.push(
      this.holdingRepository.upsert(
        order.userId,
        {
          assetSymbol: order.assetSymbol,
          quantity: order.quantity,
          averagePrice,
        },
        transaction,
      ),

      this.accountRepository.increment(
        order.userId,
        -total,
        -order.openPrice,
        transaction,
      ),
    );

    return promises;
  }

  private processSellOrder(
    order: OrderEntity,
    holding: HoldingEntity,
    total: number,
    transaction: Transaction,
  ): Promise<any>[] {
    const promises: Promise<any>[] = [];
    promises.push(
      this.accountRepository.increment(order.userId, total, null, transaction),
    );
    const quantity = holding.quantity - order.quantity;
    if (quantity > 0) {
      promises.push(
        this.holdingRepository.upsert(
          order.userId,
          {
            assetSymbol: order.assetSymbol,
            quantity,
          },
          transaction,
        ),
      );
    } else {
      promises.push(
        this.holdingRepository.delete(
          order.userId,
          order.assetSymbol,
          transaction,
        ),
      );
    }

    return promises;
  }
}
