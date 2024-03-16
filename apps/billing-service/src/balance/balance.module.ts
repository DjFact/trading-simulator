import { Logger, Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { AccountRepository } from '../repository/account.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from '../model/account.model';
import { MqModule } from '../../../../common/mq/mq.module';

@Module({
  imports: [SequelizeModule.forFeature([Account]), MqModule],
  controllers: [BalanceController],
  providers: [BalanceService, AccountRepository, Logger],
})
export class BalanceModule {}
