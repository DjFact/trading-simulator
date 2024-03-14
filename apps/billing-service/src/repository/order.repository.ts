/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IOrderRepository } from './order-repository.interface';
import { Order } from '../model/order.model';
import { Transaction } from 'sequelize';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(@InjectModel(Order) private readonly orderModel: typeof Order) {}

  async findById(id: string, transaction?: Transaction): Promise<Order> {
    return this.orderModel.findByPk(id, { transaction });
  }

  async findAllByUserId(userId: string): Promise<Order[]> {
    return this.orderModel.findAll({ where: { userId } });
  }

  async create(
    order: Partial<Order>,
    transaction?: Transaction,
  ): Promise<Order> {
    return this.orderModel.create(order, { transaction });
  }

  async update(
    id: string,
    order: Partial<Order>,
    transaction?: Transaction,
  ): Promise<[affectedCount: number, affectedRows: Order[]]> {
    return this.orderModel.update(order, {
      where: { id },
      returning: true,
      transaction,
    });
  }
}
