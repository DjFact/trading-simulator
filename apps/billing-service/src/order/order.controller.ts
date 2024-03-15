/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { BillingCommandEnum } from '../../../../common/enum/billing-command.enum';
import { UserDto } from '../../../../common/dto/user.dto';
import { OrderDto } from '../../../../common/dto/order.dto';
import { OrderCreateDto } from '../../../../common/dto/order-create.dto';
import { OrderEntity } from '../../../../common/entity/order.entity';
import { OrderFilterDto } from '../../../../common/dto/order-filter.dto';
import { TotalDataEntity } from '../../../../common/entity/total-data.entity';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: BillingCommandEnum.GetOrders })
  getOrders(
    @Payload() { userId, ...filter }: UserDto & OrderFilterDto,
  ): Promise<TotalDataEntity<OrderEntity[]>> {
    return this.orderService.getOrders(userId, filter);
  }

  @MessagePattern({ cmd: BillingCommandEnum.CreateOrder })
  createOrder(
    @Payload() { userId, ...order }: UserDto & OrderCreateDto,
  ): Promise<OrderEntity> {
    return this.orderService.createOrder(userId, order);
  }

  @MessagePattern({ cmd: BillingCommandEnum.CancelOrder })
  cancelOrder(
    @Payload() { userId, orderId }: UserDto & OrderDto,
  ): Promise<OrderEntity> {
    return this.orderService.cancelOrder(userId, orderId);
  }
}
