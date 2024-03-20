/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoyaltyCommandEnum } from '../../../../common/enum/loyalty-command.enum';
import { TotalDataEntity } from '../../../../common/entity/total-data.entity';
import { LoyaltyPrizeService } from './loyalty-prize.service';
import { LoyaltyPrizeEntity } from '../../../../common/entity/loyalty-prize.entity';
import { LoyaltyPrizeCreateDto } from '../../../../common/dto/loyalty-prize-create.dto';
import { LoyaltyPrizeUpdateDto } from '../../../../common/dto/loyalty-prize-update.dto';
import { LoyaltyPrizeDto } from '../../../../common/dto/loyalty-prize.dto';
import { LoyaltyPrizeFilterDto } from '../../../../common/dto/loyalty-prize-filter.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class LoyaltyPrizeController {
  constructor(private readonly prizeService: LoyaltyPrizeService) {}

  @MessagePattern({ cmd: LoyaltyCommandEnum.GetAllPrizes })
  getAllPrizes(
    @Payload() prize: LoyaltyPrizeFilterDto,
  ): Promise<TotalDataEntity<LoyaltyPrizeEntity[]>> {
    return this.prizeService.getAllPrizes(prize);
  }

  @MessagePattern({ cmd: LoyaltyCommandEnum.CreatePrize })
  createPrize(
    @Payload() prize: LoyaltyPrizeCreateDto,
  ): Promise<LoyaltyPrizeEntity> {
    return this.prizeService.createPrize(prize);
  }

  @MessagePattern({ cmd: LoyaltyCommandEnum.UpdatePrize })
  updatePrize(
    @Payload() { id, ...prize }: LoyaltyPrizeUpdateDto & LoyaltyPrizeDto,
  ): Promise<LoyaltyPrizeEntity> {
    return this.prizeService.updatePrize(id, prize);
  }

  @MessagePattern({ cmd: LoyaltyCommandEnum.DeletePrize })
  deletePrize(@Payload() prize: LoyaltyPrizeDto): Promise<boolean> {
    return this.prizeService.deletePrize(prize);
  }
}
