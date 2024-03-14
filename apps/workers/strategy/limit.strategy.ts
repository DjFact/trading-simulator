/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 14/03/2024 18:47
 */
import { IStrategy } from './strategy.interface';
import { BaseStrategy } from './base.strategy';
import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../../../common/entity/order.entity';

@Injectable()
export class LimitStrategy extends BaseStrategy implements IStrategy {
  async processOrder(order: OrderEntity, closePrice: number): Promise<void> {

  }
}
