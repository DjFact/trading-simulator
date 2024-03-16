/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 22:55
 */
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
  indexes: [{ fields: ['userId', { name: 'createdAt', order: 'ASC' }] }],
})
export class UserPrizePoint extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @Column({ type: DataType.UUID, allowNull: false })
  orderId: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  points: number;

  @Column({ type: DataType.DATE })
  createdAt: Date;
}
