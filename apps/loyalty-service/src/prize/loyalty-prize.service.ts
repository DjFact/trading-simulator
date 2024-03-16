/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Injectable } from '@nestjs/common';
import { TotalDataEntity } from '../../../../common/entity/total-data.entity';
import { LoyaltyPrizeEntity } from '../../../../common/entity/loyalty-prize.entity';
import { LoyaltyPrizeCreateDto } from '../../../../common/dto/loyalty-prize-create.dto';
import { LoyaltyPrizeUpdateDto } from '../../../../common/dto/loyalty-prize-update.dto';
import { LoyaltyPrizeDto } from '../../../../common/dto/loyalty-prize.dto';
import { LoyaltyPrizeFilterDto } from '../../../../common/dto/loyalty-prize-filter.dto';
import { LoyaltyPrizeRepository } from '../repository/loyalty-prize.repository';
import { LoyaltyException } from '../../../../common/exception/loyalty.exception';
import { ExceptionCodeEnum } from '../../../../common/enum/exception-code.enum';

@Injectable()
export class LoyaltyPrizeService {
  constructor(private readonly prizeRepository: LoyaltyPrizeRepository) {}

  async getAllPrizes(
    prizeFilter: LoyaltyPrizeFilterDto,
  ): Promise<TotalDataEntity<LoyaltyPrizeEntity[]>> {
    const { rows, count } = await this.prizeRepository.findAll(prizeFilter);

    const data = rows.map((prize) => new LoyaltyPrizeEntity(prize));
    return new TotalDataEntity(data, count);
  }

  async createPrize(
    prizeDto: LoyaltyPrizeCreateDto,
  ): Promise<LoyaltyPrizeEntity> {
    const prize = await this.prizeRepository.create(prizeDto);
    return new LoyaltyPrizeEntity(prize);
  }

  async updatePrize(
    id: number,
    prizeDto: LoyaltyPrizeUpdateDto,
  ): Promise<LoyaltyPrizeEntity> {
    const [affectedCount, [updatedPrize]] = await this.prizeRepository.update(
      id,
      prizeDto,
    );
    if (affectedCount === 0) {
      throw new LoyaltyException(
        'Loyalty prize not found',
        ExceptionCodeEnum.LoyaltyPrizeNotFound,
      );
    }

    return new LoyaltyPrizeEntity(updatedPrize);
  }

  async deletePrize(prize: LoyaltyPrizeDto): Promise<boolean> {
    const affectedCount = await this.prizeRepository.delete(prize.id);
    if (affectedCount === 0) {
      throw new LoyaltyException(
        'Loyalty prize not found',
        ExceptionCodeEnum.LoyaltyPrizeNotFound,
      );
    }

    return true;
  }
}
