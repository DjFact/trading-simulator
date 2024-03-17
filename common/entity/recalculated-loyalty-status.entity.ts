/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17/03/2024 13:17
 */
import { UserLoyaltyStatusEntity } from './user-loyalty-status.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserLoyaltyStatus } from '../../apps/loyalty-service/src/model/user-loyalty-status.model';

export class RecalculatedLoyaltyStatusEntity {
  @ApiProperty({
    type: UserLoyaltyStatusEntity,
    description: 'User loyalty status',
  })
  status: UserLoyaltyStatusEntity;

  @ApiProperty({ type: Boolean, description: 'Is new status' })
  isNew: boolean;

  constructor(status: UserLoyaltyStatus, isNew: boolean) {
    this.status = new UserLoyaltyStatusEntity(status);
    this.isNew = isNew;
  }
}
