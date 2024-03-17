/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 14/03/2024 18:56
 */
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from '../../billing-service/src/model/account.model';
import { Holding } from '../../billing-service/src/model/holding.model';
import { Order } from '../../billing-service/src/model/order.model';
import { MarketStrategy } from './market.strategy';
import { StopLossStrategy } from './stop-loss.strategy';
import { LimitStrategy } from './limit.strategy';
import { StrategyFactory } from './strategy.factory';
import { OrderService } from '../../billing-service/src/order/order.service';
import { OrderRepository } from '../../billing-service/src/repository/order.repository';
import { AccountRepository } from '../../billing-service/src/repository/account.repository';
import { HoldingRepository } from '../../billing-service/src/repository/holding.repository';
import { MqModule } from '../../../common/mq/mq.module';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([Account, Holding, Order]),
    MqModule,
  ],
  providers: [
    StrategyFactory,
    MarketStrategy,
    StopLossStrategy,
    LimitStrategy,
    OrderService,
    OrderRepository,
    AccountRepository,
    HoldingRepository,
    Logger,
  ],
  exports: [StrategyFactory],
})
export class StrategyModule {}
