/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Controller } from '@nestjs/common';
import { LoyaltyStatusService } from './loyalty-status.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TotalDataEntity } from '../../../../common/entity/total-data.entity';
import { LoyaltyCommandEnum } from '../../../../common/enum/loyalty-command.enum';
import { LoyaltyStatusCreateDto } from '../../../../common/dto/loyalty-status-create.dto';
import { LoyaltyStatusUpdateDto } from '../../../../common/dto/loyalty-status-update.dto';
import { LoyaltyStatusDto } from '../../../../common/dto/loyalty-status.dto';
import { LoyaltyStatusEntity } from '../../../../common/entity/loyalty-status.entity';

@Controller()
export class LoyaltyStatusController {
  constructor(private readonly statusService: LoyaltyStatusService) {}

  @MessagePattern({ cmd: LoyaltyCommandEnum.GetAllStatuses })
  getAllStatuses(): Promise<TotalDataEntity<LoyaltyStatusEntity[]>> {
    return this.statusService.getAllStatuses();
  }

  @MessagePattern({ cmd: LoyaltyCommandEnum.CreateStatus })
  createStatus(
    @Payload() status: LoyaltyStatusCreateDto,
  ): Promise<LoyaltyStatusEntity> {
    return this.statusService.createStatus(status);
  }

  @MessagePattern({ cmd: LoyaltyCommandEnum.UpdateStatus })
  updateStatus(
    @Payload() { name, ...status }: LoyaltyStatusUpdateDto & LoyaltyStatusDto,
  ): Promise<LoyaltyStatusEntity> {
    return this.statusService.updateStatus(name, status);
  }

  @MessagePattern({ cmd: LoyaltyCommandEnum.DeleteStatus })
  deleteStatus(@Payload() status: LoyaltyStatusDto): Promise<boolean> {
    return this.statusService.deleteStatus(status);
  }
}
