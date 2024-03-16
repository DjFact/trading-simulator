/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Order } from '../model/order.model';
import { Transaction } from 'sequelize';
import { OrderFilterDto } from '../../../../common/dto/order-filter.dto';

export interface IOrderRepository {
  findLastByUserId(userId: string): Promise<Order | null>;

  findById(id: string, transaction?: Transaction): Promise<Order>;

  findAllByUserId(
    userId: string,
    { status, startDate, endDate, ...pageDto }: OrderFilterDto,
  ): Promise<{ rows: Order[]; count: number }>;

  create(order: Partial<Order>, transaction?: Transaction): Promise<Order>;

  update(
    id: string,
    order: Partial<Order>,
    transaction?: Transaction,
  ): Promise<[affectedCount: number, affectedRows: Order[]]>;
}
