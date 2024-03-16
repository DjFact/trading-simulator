/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 10:40
 */
import { InjectModel } from '@nestjs/sequelize';
import { IUserLoyaltyOrderRepository } from './user-loyalty-order-repository.interface';
import { UserLoyaltyOrder } from '../model/user-loyalty-order.model';
import { Transaction } from 'sequelize';

export class UserLoyaltyOrderRepository implements IUserLoyaltyOrderRepository {
  constructor(
    @InjectModel(UserLoyaltyOrder)
    private readonly userOrderModel: typeof UserLoyaltyOrder,
  ) {}

  async create(
    order: Partial<UserLoyaltyOrder>,
    transaction: Transaction,
  ): Promise<UserLoyaltyOrder> {
    return this.userOrderModel.create(order, { transaction });
  }
}
