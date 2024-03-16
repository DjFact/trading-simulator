/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 00:06
 */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Prize } from './prize.model';
import { OrderStatusEnum } from '../../../../common/enum/order-status.enum';

@Table({ timestamps: true })
export class UserOrder extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @ForeignKey(() => Prize)
  @Column({ type: DataType.INTEGER, allowNull: false })
  prizeId: number;

  @Column({ type: DataType.CHAR(255), allowNull: false })
  status: OrderStatusEnum;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @BelongsTo(() => Prize)
  prize?: Prize;
}
