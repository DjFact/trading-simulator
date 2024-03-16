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
import { LoyaltyStatusEnum } from '../../../../common/enum/loyalty.enum';
import { Status } from './status.model';

@Table({ timestamps: true })
export class Prize extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @ForeignKey(() => Status)
  @Column({ type: DataType.STRING, allowNull: false })
  loyalty: LoyaltyStatusEnum;

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
