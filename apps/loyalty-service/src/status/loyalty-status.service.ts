/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Injectable } from '@nestjs/common';
import { LoyaltyStatusCreateDto } from '../../../../common/dto/loyalty-status-create.dto';
import { LoyaltyStatusUpdateDto } from '../../../../common/dto/loyalty-status-update.dto';
import { LoyaltyStatusDto } from '../../../../common/dto/loyalty-status.dto';
import { TotalDataEntity } from '../../../../common/entity/total-data.entity';
import { LoyaltyStatusEntity } from '../../../../common/entity/loyalty-status.entity';
import { LoyaltyStatusRepository } from '../repository/loyalty-status.repository';
import { LoyaltyException } from '../../../../common/exception/loyalty.exception';
import { ExceptionCodeEnum } from '../../../../common/enum/exception-code.enum';

@Injectable()
export class LoyaltyStatusService {
  constructor(private readonly statusRepository: LoyaltyStatusRepository) {}

  async getAllStatuses(): Promise<TotalDataEntity<LoyaltyStatusEntity[]>> {
    const { rows, count } = await this.statusRepository.findAll();

    const data = rows.map((status) => new LoyaltyStatusEntity(status));
    return new TotalDataEntity(data, count);
  }

  async createStatus(
    statusDto: LoyaltyStatusCreateDto,
  ): Promise<LoyaltyStatusEntity> {
    try {
      const status = await this.statusRepository.create(statusDto);
      return new LoyaltyStatusEntity(status);
    } catch (e) {
      throw new LoyaltyException(
        'Loyalty status already exists',
        ExceptionCodeEnum.LoyaltyStatusAlreadyExists,
      );
    }
  }

  async updateStatus(
    name: string,
    status: LoyaltyStatusUpdateDto,
  ): Promise<LoyaltyStatusEntity> {
    const [affectedCount, [updatedStatus]] = await this.statusRepository.update(
      name,
      status,
    );
    if (affectedCount === 0) {
      throw new LoyaltyException(
        'Loyalty status not found',
        ExceptionCodeEnum.LoyaltyStatusNotFound,
      );
    }

    return new LoyaltyStatusEntity(updatedStatus);
  }

  async deleteStatus(status: LoyaltyStatusDto): Promise<boolean> {
    const affectedCount = await this.statusRepository.delete(status.name);
    if (affectedCount === 0) {
      throw new LoyaltyException(
        'Loyalty status not found',
        ExceptionCodeEnum.LoyaltyStatusNotFound,
      );
    }

    return true;
  }
}
