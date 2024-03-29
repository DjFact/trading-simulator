/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 22:55
 */
import {
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { LoyaltyStatus } from './loyalty-status.model';

@Table({
  timestamps: true,
  indexes: [
    { fields: ['country', 'loyalty', { name: 'createdAt', order: 'DESC' }] },
  ],
})
export class LoyaltyPrize extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number;

  @Index
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @ForeignKey(() => LoyaltyStatus)
  @Column({ type: DataType.STRING, allowNull: false })
  loyalty: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  points: number;

  @Column({ type: DataType.CHAR(2), allowNull: true })
  country: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  enabled: boolean;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
