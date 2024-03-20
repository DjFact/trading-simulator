/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 10:40
 */
import { InjectModel } from '@nestjs/sequelize';
import { IUserLoyaltyStatusRepository } from './user-loyalty-status-repository.interface';
import { UserLoyaltyStatus } from '../model/user-loyalty-status.model';
import { LoyaltyStatus } from '../model/loyalty-status.model';
import { UserLoyaltyPrizePoint } from '../model/user-loyalty-prize-point.model';
import { Op, Transaction } from 'sequelize';
import { UserLoyaltyOrder } from '../model/user-loyalty-order.model';
import { LoyaltyPrize } from '../model/loyalty-prize.model';

export class UserLoyaltyStatusRepository
  implements IUserLoyaltyStatusRepository
{
  constructor(
    @InjectModel(UserLoyaltyStatus)
    private readonly userStatusModel: typeof UserLoyaltyStatus,
  ) {}

  async findByUserId(
    userId: string,
    transaction?: Transaction,
  ): Promise<UserLoyaltyStatus> {
    return this.userStatusModel.findByPk(userId, {
      include: [
        LoyaltyStatus,
        {
          model: UserLoyaltyPrizePoint,
          where: {
            createdAt: {
              [Op.gt]: new Date(Date.now() - 360 * 24 * 60 * 60 * 1000),
            },
          },
          attributes: ['points'],
          required: false,
        },
        {
          model: UserLoyaltyOrder,
          include: [LoyaltyPrize],
        },
      ],
      transaction,
    });
  }

  async create(
    userStatus: Partial<UserLoyaltyStatus>,
    transaction: Transaction,
  ): Promise<UserLoyaltyStatus> {
    return this.userStatusModel.create(userStatus, { transaction });
  }

  async update(
    userId: string,
    userStatus: Partial<UserLoyaltyStatus>,
    transaction: Transaction,
  ): Promise<[number, UserLoyaltyStatus[]]> {
    return this.userStatusModel.update(userStatus, {
      where: { userId },
      returning: true,
      transaction,
    });
  }
}
