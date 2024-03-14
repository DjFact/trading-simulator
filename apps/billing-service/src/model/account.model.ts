/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 11/03/2024 23:45
 */
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Holding } from './holding.model';

@Table({ timestamps: true })
export class Account extends Model {
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  userId: string;

  @Column({ type: DataType.DECIMAL(20, 8), defaultValue: 0 })
  balance: number;

  @Column({ type: DataType.DECIMAL(20, 8), defaultValue: 0 })
  reserved: number;

  @HasMany(() => Holding)
  holdings: Holding[];

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
