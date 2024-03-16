/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 16/03/2024 10:40
 */
import { LoyaltyPrize } from '../model/loyalty-prize.model';
import { LoyaltyPrizeFilterDto } from '../../../../common/dto/loyalty-prize-filter.dto';

export interface ILoyaltyPrizeRepository {
  findById(id: number): Promise<LoyaltyPrize>;

  findAll(
    prizeFilter: LoyaltyPrizeFilterDto,
  ): Promise<{ rows: LoyaltyPrize[]; count: number }>;

  create(prize: Partial<LoyaltyPrize>): Promise<LoyaltyPrize>;

  update(
    id: number,
    prize: Partial<LoyaltyPrize>,
  ): Promise<[number, LoyaltyPrize[]]>;

  delete(id: number): Promise<number>;
}
