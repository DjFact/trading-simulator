/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Module } from '@nestjs/common';
import { LoyaltyPrizeController } from './loyalty-prize.controller';
import { LoyaltyPrizeService } from './loyalty-prize.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoyaltyPrize } from '../model/loyalty-prize.model';
import { LoyaltyPrizeRepository } from '../repository/loyalty-prize.repository';

@Module({
  imports: [SequelizeModule.forFeature([LoyaltyPrize])],
  controllers: [LoyaltyPrizeController],
  providers: [LoyaltyPrizeService, LoyaltyPrizeRepository],
})
export class LoyaltyPrizeModule {}
