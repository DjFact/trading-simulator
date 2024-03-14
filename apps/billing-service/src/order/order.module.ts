import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from '../model/account.model';
import { Holding } from '../model/holding.model';
import { Order } from '../model/order.model';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from '../repository/order.repository';
import { AccountRepository } from '../repository/account.repository';

@Module({
  imports: [SequelizeModule.forFeature([Account, Holding, Order])],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, AccountRepository, Logger],
})
export class OrderModule {}
