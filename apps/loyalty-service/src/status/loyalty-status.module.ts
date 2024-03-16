/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Module } from '@nestjs/common';
import { LoyaltyStatusController } from './loyalty-status.controller';
import { LoyaltyStatusService } from './loyalty-status.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoyaltyStatus } from '../model/loyalty-status.model';
import { LoyaltyStatusRepository } from '../repository/loyalty-status.repository';

@Module({
  imports: [SequelizeModule.forFeature([LoyaltyStatus])],
  controllers: [LoyaltyStatusController],
  providers: [LoyaltyStatusService, LoyaltyStatusRepository],
})
export class LoyaltyStatusModule {}
