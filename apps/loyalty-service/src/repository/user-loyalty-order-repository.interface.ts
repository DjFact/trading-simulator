/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 10:40
 */
import { UserLoyaltyOrder } from '../model/user-loyalty-order.model';
import { Transaction } from 'sequelize';

export interface IUserLoyaltyOrderRepository {
  create(
    order: Partial<UserLoyaltyOrder>,
    transaction: Transaction,
  ): Promise<UserLoyaltyOrder>;
}
