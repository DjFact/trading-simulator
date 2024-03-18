/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 08/03/2024 17:01
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { DateFilterDto } from '../../../../common/dto/date-filter.dto';
import { Op, Transaction } from 'sequelize';
import { IUserRepository } from './user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async findById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findByEmail(
    email: string,
    transaction?: Transaction,
  ): Promise<User | null> {
    return this.userModel.findOne({ where: { email }, transaction });
  }

  async create(user: User, transaction?: Transaction): Promise<User> {
    return this.userModel.create(user as any, { transaction });
  }

  async findAll({
    startDate,
    endDate,
    ...pageDto
  }: DateFilterDto): Promise<{ rows: User[]; count: number }> {
    const where = {};
    if (startDate && endDate) {
      where['createdAt'] = {
        [Op.between]: [startDate, endDate],
      };
    }

    return this.userModel.findAndCountAll({
      ...pageDto,
      where,
    });
  }

  async updateById(id: string, user: User): Promise<[number, User[]]> {
    return this.userModel.update(user as any, {
      where: { id },
      returning: true,
    });
  }

  async deleteByEmail(email: string): Promise<number> {
    return this.userModel.destroy({ where: { email } });
  }
}
