/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 10:40
 */
import { LoyaltyStatus } from '../model/loyalty-status.model';
import { Transaction } from 'sequelize';

export interface ILoyaltyStatusRepository {
  findAll(
    transaction?: Transaction,
  ): Promise<{ rows: LoyaltyStatus[]; count: number }>;

  create(status: Partial<LoyaltyStatus>): Promise<LoyaltyStatus>;

  update(
    name: string,
    status: Partial<LoyaltyStatus>,
  ): Promise<[number, LoyaltyStatus[]]>;

  delete(name: string): Promise<number>;
}
