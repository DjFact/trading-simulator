/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 11/03/2024 23:45
 */
import {
  BeforeCreate,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Account } from './account.model';
import { OrderStatusEnum } from '../../../../common/enum/order-status.enum';
import { OrderTypeEnum } from '../../../../common/enum/order-type.enum';
import { OrderActionTypeEnum } from '../../../../common/enum/order-action-type.enum';
import { v4 as uuidv4 } from 'uuid';

@Table({ timestamps: true })
export class Order extends Model {
  @PrimaryKey
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  id: string;

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
    allowNull: false,
    type: DataType.INTEGER,
  })
  quantity: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  action: OrderActionTypeEnum;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  orderType: OrderTypeEnum;

  @Column({
    allowNull: true,
    type: DataType.FLOAT,
  })
  limit?: number;

  @Column({
    allowNull: false,
    type: DataType.FLOAT,
  })
  openPrice: number;

  @Column({
    allowNull: true,
    type: DataType.FLOAT,
  })
  closePrice?: number;

  @Column({
    allowNull: true,
    type: DataType.FLOAT,
  })
  total?: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  status: OrderStatusEnum;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  info?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  closedAt?: Date;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @BeforeCreate
  static async generateId(instance: Order): Promise<void> {
    instance.id = uuidv4();
  }
}
