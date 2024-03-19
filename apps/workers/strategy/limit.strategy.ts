/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 14/03/2024 18:47
 */
import { IStrategy } from './strategy.interface';
import { BaseStrategy } from './base.strategy';
import { Injectable, Logger } from '@nestjs/common';
import { OrderEntity } from '../../../common/entity/order.entity';
import { Sequelize } from 'sequelize-typescript';
import { OrderService } from '../../billing-service/src/order/order.service';
import { AccountRepository } from '../../billing-service/src/repository/account.repository';
import { HoldingRepository } from '../../billing-service/src/repository/holding.repository';
import { OrderRepository } from '../../billing-service/src/repository/order.repository';

@Injectable()
export class LimitStrategy extends BaseStrategy implements IStrategy {
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

  async processOrder(): Promise<OrderEntity> {
    return null;
  }
}
