import { Logger, Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { AccountRepository } from '../repository/account.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from '../model/account.model';

@Module({
  imports: [SequelizeModule.forFeature([Account])],
  controllers: [BalanceController],
  providers: [BalanceService, AccountRepository, Logger],
})
export class BalanceModule {}
