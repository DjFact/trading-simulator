/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyService } from '../../../../../common/client-proxy/client-proxy.service';
import { MicroserviceEnum } from '../../../../../common/enum/microservice.enum';
import { LoyaltyCommandEnum } from '../../../../../common/enum/loyalty-command.enum';
import { TotalDataEntity } from '../../../../../common/entity/total-data.entity';
import { LoyaltyStatusEntity } from '../../../../../common/entity/loyalty-status.entity';
import { LoyaltyStatusCreateDto } from '../../../../../common/dto/loyalty-status-create.dto';
import { LoyaltyStatusUpdateDto } from '../../../../../common/dto/loyalty-status-update.dto';

@Injectable()
export class GatewayLoyaltyStatusService {
  constructor(protected readonly clientProxyService: ClientProxyService) {}

  getAllStatuses(): Observable<TotalDataEntity<LoyaltyStatusEntity[]>> {
    return this.clientProxyService.send<TotalDataEntity<LoyaltyStatusEntity[]>>(
      MicroserviceEnum.LoyaltyService,
      { cmd: LoyaltyCommandEnum.GetAllStatuses },
      {},
    );
  }

  createStatus(
    status: LoyaltyStatusCreateDto,
  ): Observable<LoyaltyStatusEntity> {
    return this.clientProxyService.send<LoyaltyStatusEntity>(
      MicroserviceEnum.LoyaltyService,
      { cmd: LoyaltyCommandEnum.CreateStatus },
      status,
    );
  }

  updateStatus(
    name: string,
    status: LoyaltyStatusUpdateDto,
  ): Observable<LoyaltyStatusEntity> {
    return this.clientProxyService.send<LoyaltyStatusEntity>(
      MicroserviceEnum.LoyaltyService,
      { cmd: LoyaltyCommandEnum.UpdateStatus },
      { name, ...status },
    );
  }

  deleteStatus(name: string): Observable<boolean> {
    return this.clientProxyService.send<boolean>(
      MicroserviceEnum.LoyaltyService,
      { cmd: LoyaltyCommandEnum.DeleteStatus },
      { name },
    );
  }
}
