/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 10:40
 */
import { UserLoyaltyStatus } from '../model/user-loyalty-status.model';
import { Transaction } from 'sequelize';

export interface IUserLoyaltyStatusRepository {
  findByUserId(
    userId: string,
    transaction?: Transaction,
  ): Promise<UserLoyaltyStatus>;

  create(
    userStatus: Partial<UserLoyaltyStatus>,
    transaction: Transaction,
  ): Promise<UserLoyaltyStatus>;

  update(
    userId: string,
    userStatus: Partial<UserLoyaltyStatus>,
    transaction: Transaction,
  ): Promise<[number, UserLoyaltyStatus[]]>;
}
