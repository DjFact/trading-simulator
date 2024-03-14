/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 11/03/2024 23:45
 */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Account } from './account.model';

@Table({ timestamps: true })
export class Holding extends Model {
  @ForeignKey(() => Account)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  assetSymbol: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  averagePurchasePrice: number;

  @BelongsTo(() => Account)
  account: Account;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
