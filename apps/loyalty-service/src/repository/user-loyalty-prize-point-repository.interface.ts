/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 10:40
 */
import { UserLoyaltyPrizePoint } from '../model/user-loyalty-prize-point.model';
import { Transaction } from 'sequelize';

export interface IUserLoyaltyPrizePointRepository {
  getByUserId(
    userId: string,
    transaction?: Transaction,
  ): Promise<Partial<UserLoyaltyPrizePoint>[]>;

  create(
    data: Partial<UserLoyaltyPrizePoint>,
    transaction?: Transaction,
  ): Promise<UserLoyaltyPrizePoint>;

  updateById(
    id: number,
    data: Partial<UserLoyaltyPrizePoint>,
    transaction?: Transaction,
  ): Promise<[number]>;

  removeByIds(ids: number[], transaction?: Transaction): Promise<number>;

  removeOlderThenInSec(olderThen: number): Promise<number>;
}
