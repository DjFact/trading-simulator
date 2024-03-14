/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { BillingCommandEnum } from '../../../../common/enum/billing-command.enum';
import { UserDto } from '../../../../common/dto/user.dto';
import { OrderCancelDto } from '../../../../common/dto/order-cancel.dto';
import { OrderCreateDto } from '../../../../common/dto/order-create.dto';
import { OrderEntity } from '../../../../common/entity/order.entity';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: BillingCommandEnum.GetOrders })
  getOrders(@Payload() user: UserDto): Promise<OrderEntity[]> {
    return this.orderService.getOrders(user);
  }

  @MessagePattern({ cmd: BillingCommandEnum.CreateOrder })
  createOrder(@Payload() order: OrderCreateDto) {
    return this.orderService.createOrder(order);
  }

  @MessagePattern({ cmd: BillingCommandEnum.CancelOrder })
  cancelOrder(@Payload() order: OrderCancelDto) {
    return this.orderService.cancelOrder(order);
  }
}
