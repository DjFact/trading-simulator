/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IAccountRepository } from './account-repository.interface';
import { Account } from '../model/account.model';
import { Holding } from '../model/holding.model';
import { Transaction } from 'sequelize';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectModel(Account) private readonly accountModel: typeof Account,
  ) {}

  async findByUserId(
    userId: string,
    transaction?: Transaction,
  ): Promise<Account | null> {
    return this.accountModel.findByPk(userId, {
      include: [Holding],
      transaction,
    });
  }

  async create(userId: string): Promise<Account> {
    return this.accountModel.create({ userId });
  }

  async increment(
    userId: string,
    balance?: number,
    reserved?: number,
    transaction?: Transaction,
  ): Promise<[affectedRows: Account[], affectedCount?: number]> {
    return this.accountModel.increment(
      { balance, reserved },
      {
        where: { userId },
        transaction,
      },
    );
  }
}
