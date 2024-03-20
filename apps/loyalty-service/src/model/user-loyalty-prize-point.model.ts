/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 22:55
 */
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserLoyaltyStatus } from './user-loyalty-status.model';

@Table({
  timestamps: true,
  indexes: [
    { fields: ['userId', 'orderId'], unique: true },
    { fields: ['userId', { name: 'createdAt', order: 'ASC' }] },
  ],
})
export class UserLoyaltyPrizePoint extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number;

  @ForeignKey(() => UserLoyaltyStatus)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @Column({ type: DataType.UUID, allowNull: false })
  orderId: string;

  @Column({ type: DataType.FLOAT, defaultValue: 0 })
  points: number;

  @Column({ type: DataType.DATE })
  createdAt: Date;
}
