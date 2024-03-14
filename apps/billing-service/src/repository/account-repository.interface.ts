/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Account } from '../model/account.model';
import { Transaction } from 'sequelize';

export interface IAccountRepository {
  findByUserId(
    userId: string,
    transaction?: Transaction,
  ): Promise<Account | null>;

  create(userId: string): Promise<Account>;

  increment(
    userId: string,
    balance?: number,
    reserved?: number,
    transaction?: Transaction,
  ): Promise<[affectedRows: Account[], affectedCount?: number]>;
}
