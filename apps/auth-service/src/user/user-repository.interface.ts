/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 08/03/2024 18:01
 */
import { User } from './user.model';
import { DateFilterDto } from '../../../../common/dto/date-filter.dto';
import { Transaction } from 'sequelize';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;

  findByEmail(email: string, transaction?: Transaction): Promise<User | null>;

  create(user: User, transaction?: Transaction): Promise<User>;

  findAll({
    startDate,
    endDate,
    ...pageDto
  }: DateFilterDto): Promise<{ rows: User[]; count: number }>;

  updateById(id: string, user: User): Promise<[number, User[]]>;

  deleteByEmail(email: string): Promise<number>;
}
