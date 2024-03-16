/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 22:55
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
import { LoyaltyStatusEnum } from '../../../../common/enum/loyalty.enum';
import { Status } from './status.model';

@Table({ timestamps: true })
export class UserStatus extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @ForeignKey(() => Status)
  @Column({ type: DataType.STRING, allowNull: false })
  status: LoyaltyStatusEnum;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  points: number;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;

  @BelongsTo(() => Status)
  loyalty?: Status;
}
