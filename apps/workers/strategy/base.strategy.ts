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

export abstract class BaseStrategy implements IStrategy {
  constructor(
    protected readonly sequelize: Sequelize,
    protected readonly orderService: OrderService,
    protected readonly accountRepository: AccountRepository,
    protected readonly holdingRepository: HoldingRepository,
    protected readonly orderRepository: OrderRepository,
    protected readonly logger: Logger,
  ) {}

  abstract processOrder(order: OrderEntity, price: number): Promise<void>;
}
