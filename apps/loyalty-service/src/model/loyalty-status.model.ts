/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 21:23
 */
import {
  Column,
  DataType,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { LoyaltyStatusEnum } from '../../../../common/enum/loyalty.enum';
import { LoyaltyPrize } from './loyalty-prize.model';

@Table({ timestamps: true })
export class LoyaltyStatus extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: LoyaltyStatusEnum.Executive,
  })
  name: string;

  @Index
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  points: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  deposit: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  prizeCoef: number;

  @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: 0 })
  expiresAfterDays: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  pricePoints?: number;

  /** Trade time in seconds */
  @Column({ type: DataType.INTEGER, allowNull: true })
  tradeTime?: number;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @HasMany(() => LoyaltyPrize)
  prizes?: LoyaltyPrize[];
}
