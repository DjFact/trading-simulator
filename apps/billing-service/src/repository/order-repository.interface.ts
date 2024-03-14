/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Order } from '../model/order.model';
import { Transaction } from 'sequelize';

export interface IOrderRepository {
  findById(id: string, transaction?: Transaction): Promise<Order>;

  findAllByUserId(userId: string): Promise<Order[]>;

  create(order: Partial<Order>, transaction?: Transaction): Promise<Order>;

  update(
    id: string,
    order: Partial<Order>,
    transaction?: Transaction,
  ): Promise<[affectedCount: number, affectedRows: Order[]]>;
}
