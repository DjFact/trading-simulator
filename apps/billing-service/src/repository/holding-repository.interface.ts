/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Transaction } from 'sequelize';
import { Holding } from '../model/holding.model';

export interface IHoldingRepository {
  upsert(
    userId: string,
    holding: Partial<Holding>,
    transaction: Transaction,
  ): Promise<[Holding, boolean]>;

  delete(
    userId: string,
    assetSymbol: string,
    transaction?: Transaction,
  ): Promise<number>;
}
