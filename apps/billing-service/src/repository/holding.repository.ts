/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Holding } from '../model/holding.model';
import { Transaction } from 'sequelize';
import { IHoldingRepository } from './holding-repository.interface';

@Injectable()
export class HoldingRepository implements IHoldingRepository {
  constructor(
    @InjectModel(Holding) private readonly holdingModel: typeof Holding,
  ) {}

  async upsert(
    userId: string,
    holding: Partial<Holding>,
    transaction: Transaction,
  ): Promise<[Holding, boolean]> {
    return this.holdingModel.upsert({ userId, ...holding }, { transaction });
  }

  async delete(
    userId: string,
    assetSymbol: string,
    transaction?: Transaction,
  ): Promise<number> {
    return this.holdingModel.destroy({
      where: { userId, assetSymbol },
      transaction,
    });
  }
}
