/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 10:40
 */
import { ILoyaltyPrizeRepository } from './loyalty-prize-repository.interface';
import { InjectModel } from '@nestjs/sequelize';
import { LoyaltyPrize } from '../model/loyalty-prize.model';
import { LoyaltyPrizeFilterDto } from '../../../../common/dto/loyalty-prize-filter.dto';
import { Op, Transaction } from 'sequelize';

export class LoyaltyPrizeRepository implements ILoyaltyPrizeRepository {
  constructor(
    @InjectModel(LoyaltyPrize)
    private readonly prizeModel: typeof LoyaltyPrize,
  ) {}

  async findById(id: number, transaction?: Transaction): Promise<LoyaltyPrize> {
    return this.prizeModel.findByPk(id, { transaction });
  }

  async findAll({
    name,
    loyalty,
    country,
    startDate,
    endDate,
    ...pageDto
  }: LoyaltyPrizeFilterDto): Promise<{ rows: LoyaltyPrize[]; count: number }> {
    const where: any = {
      ...(name && { name }),
      ...(loyalty && { loyalty }),
      ...(country && { country }),
      ...(startDate &&
        endDate && {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        }),
    };

    return this.prizeModel.findAndCountAll({ where, ...pageDto });
  }

  async create(prize: Partial<LoyaltyPrize>): Promise<LoyaltyPrize> {
    return this.prizeModel.create(prize);
  }

  async update(
    id: number,
    prize: Partial<LoyaltyPrize>,
  ): Promise<[number, LoyaltyPrize[]]> {
    return this.prizeModel.update(prize, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return this.prizeModel.destroy({ where: { id } });
  }
}
