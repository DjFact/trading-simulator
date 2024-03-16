/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 10:40
 */
import { ILoyaltyStatusRepository } from './loyalty-status-repository.interface';
import { InjectModel } from '@nestjs/sequelize';
import { LoyaltyStatus } from '../model/loyalty-status.model';
import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';

@Injectable()
export class LoyaltyStatusRepository implements ILoyaltyStatusRepository {
  constructor(
    @InjectModel(LoyaltyStatus)
    private readonly statusModel: typeof LoyaltyStatus,
  ) {}

  async findAll(
    transaction?: Transaction,
  ): Promise<{ rows: LoyaltyStatus[]; count: number }> {
    return this.statusModel.findAndCountAll({
      order: [['points', 'ASC']],
      transaction,
    });
  }

  async create(status: Partial<LoyaltyStatus>): Promise<LoyaltyStatus> {
    return this.statusModel.create(status);
  }

  async update(
    name: string,
    status: Partial<LoyaltyStatus>,
  ): Promise<[number, LoyaltyStatus[]]> {
    return this.statusModel.update(status, {
      where: { name },
      returning: true,
    });
  }

  async delete(name: string): Promise<number> {
    return this.statusModel.destroy({ where: { name } });
  }
}
