/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 21:23
 */
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { LoyaltyStatusEnum } from '../../../../common/enum/loyalty.enum';
import { Prize } from './prize.model';

@Table({ timestamps: true })
export class Status extends Model {
  @PrimaryKey
  @Column({
    type: DataType.CHAR(255),
    allowNull: false,
    defaultValue: LoyaltyStatusEnum.Executive,
  })
  name: LoyaltyStatusEnum;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  points: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  deposit: number;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  prizeCoef: number;

  /** Inactivity in days */
  @Column({ type: DataType.SMALLINT, allowNull: false, defaultValue: 0 })
  expiresAfter: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  pricePoints?: number;

  /** Trade time in seconds */
  @Column({ type: DataType.INTEGER, allowNull: true })
  tradeTime?: number;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @HasMany(() => Prize)
  prizes?: Prize[];
}
