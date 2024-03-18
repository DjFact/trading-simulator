/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 00:06
 */
import {
  BeforeCreate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { LoyaltyPrize } from './loyalty-prize.model';
import { OrderStatusEnum } from '../../../../common/enum/order-status.enum';
import { v4 as uuidv4 } from 'uuid';
import { UserLoyaltyStatus } from './user-loyalty-status.model';

@Table({ timestamps: true })
export class UserLoyaltyOrder extends Model {
  @PrimaryKey
  @Column({ allowNull: false, type: DataType.UUID })
  id: string;

  @ForeignKey(() => UserLoyaltyStatus)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @ForeignKey(() => LoyaltyPrize)
  @Column({ type: DataType.INTEGER, allowNull: false })
  prizeId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  status: OrderStatusEnum;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @BelongsTo(() => LoyaltyPrize)
  prize?: LoyaltyPrize;

  @BeforeCreate
  static async generateId(instance: UserLoyaltyOrder): Promise<void> {
    instance.id = uuidv4();
  }
}
