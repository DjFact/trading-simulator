/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyService } from '../../../../../common/client-proxy/client-proxy.service';
import { MicroserviceEnum } from '../../../../../common/enum/microservice.enum';
import { LoyaltyCommandEnum } from '../../../../../common/enum/loyalty-command.enum';
import { LoyaltyPrizeEntity } from '../../../../../common/entity/loyalty-prize.entity';
import { TotalDataEntity } from '../../../../../common/entity/total-data.entity';
import { LoyaltyPrizeDto } from '../../../../../common/dto/loyalty-prize.dto';
import { LoyaltyPrizeUpdateDto } from '../../../../../common/dto/loyalty-prize-update.dto';
import { LoyaltyPrizeCreateDto } from '../../../../../common/dto/loyalty-prize-create.dto';
import { LoyaltyPrizeFilterDto } from '../../../../../common/dto/loyalty-prize-filter.dto';

@Injectable()
export class GatewayLoyaltyPrizeService {
  constructor(protected readonly clientProxyService: ClientProxyService) {}

  getAllPrizes(
    filter: LoyaltyPrizeFilterDto,
  ): Observable<TotalDataEntity<LoyaltyPrizeEntity[]>> {
    return this.clientProxyService.send<TotalDataEntity<LoyaltyPrizeEntity[]>>(
      MicroserviceEnum.LoyaltyService,
      { cmd: LoyaltyCommandEnum.GetAllPrizes },
      filter,
    );
  }

  createPrize(prize: LoyaltyPrizeCreateDto): Observable<LoyaltyPrizeEntity> {
    return this.clientProxyService.send<LoyaltyPrizeEntity>(
      MicroserviceEnum.LoyaltyService,
      { cmd: LoyaltyCommandEnum.CreatePrize },
      prize,
    );
  }

  updatePrize(
    id: number,
    prize: LoyaltyPrizeUpdateDto,
  ): Observable<LoyaltyPrizeEntity> {
    return this.clientProxyService.send<LoyaltyPrizeEntity>(
      MicroserviceEnum.LoyaltyService,
      { cmd: LoyaltyCommandEnum.UpdatePrize },
      { id, ...prize },
    );
  }

  deletePrize(prize: LoyaltyPrizeDto): Observable<boolean> {
    return this.clientProxyService.send<boolean>(
      MicroserviceEnum.LoyaltyService,
      { cmd: LoyaltyCommandEnum.DeletePrize },
      prize,
    );
  }
}
