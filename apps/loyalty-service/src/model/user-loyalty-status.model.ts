/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 22:55
 */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { LoyaltyStatus } from './loyalty-status.model';
import { UserLoyaltyPrizePoint } from './user-loyalty-prize-point.model';
import { UserLoyaltyOrder } from './user-loyalty-order.model';

@Table({ timestamps: true })
export class UserLoyaltyStatus extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @ForeignKey(() => LoyaltyStatus)
  @Column({ type: DataType.STRING, allowNull: false })
  status: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  points: number;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @BelongsTo(() => LoyaltyStatus)
  loyalty?: LoyaltyStatus;

  @HasMany(() => UserLoyaltyPrizePoint)
  prizePoints?: UserLoyaltyPrizePoint[];

  @HasMany(() => UserLoyaltyOrder)
  prizeOrders?: UserLoyaltyOrder[];
}
