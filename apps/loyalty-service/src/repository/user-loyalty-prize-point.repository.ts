/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 10:40
 */
import { InjectModel } from '@nestjs/sequelize';
import { IUserLoyaltyPrizePointRepository } from './user-loyalty-prize-point-repository.interface';
import { UserLoyaltyPrizePoint } from '../model/user-loyalty-prize-point.model';
import { Op, Transaction } from 'sequelize';

export class UserLoyaltyPrizePointRepository
  implements IUserLoyaltyPrizePointRepository
{
  constructor(
    @InjectModel(UserLoyaltyPrizePoint)
    private readonly userPrizePointModel: typeof UserLoyaltyPrizePoint,
  ) {}

  async getByUserId(
    userId: string,
    transaction?: Transaction,
  ): Promise<Partial<UserLoyaltyPrizePoint>[]> {
    return this.userPrizePointModel.findAll({
      attributes: ['id', 'points'],
      where: { userId },
      order: [['createdAt', 'ASC']],
      transaction,
    });
  }

  async updateById(
    id: number,
    data: Partial<UserLoyaltyPrizePoint>,
    transaction?: Transaction,
  ): Promise<[number]> {
    return this.userPrizePointModel.update(data, {
      where: { id },
      transaction,
    });
  }

  async removeByIds(ids: number[], transaction?: Transaction): Promise<number> {
    return this.userPrizePointModel.destroy({
      where: { id: ids },
      transaction,
    });
  }

  async removeOlderThenInSec(olderThen: number): Promise<number> {
    return this.userPrizePointModel.destroy({
      where: {
        createdAt: {
          [Op.lte]: new Date(Date.now() - olderThen * 1000),
        },
      },
    });
  }
}
