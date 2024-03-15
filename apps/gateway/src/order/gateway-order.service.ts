/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyService } from '../../../../common/client-proxy/client-proxy.service';
import { TotalDataEntity } from '../../../../common/entity/total-data.entity';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { BillingCommandEnum } from '../../../../common/enum/billing-command.enum';
import { OrderEntity } from '../../../../common/entity/order.entity';
import { OrderFilterDto } from '../../../../common/dto/order-filter.dto';
import { OrderCreateDto } from '../../../../common/dto/order-create.dto';
import { OrderDto } from '../../../../common/dto/order.dto';

@Injectable()
export class GatewayOrderService {
  constructor(protected readonly clientProxyService: ClientProxyService) {}

  getAll(
    userId: string,
    orderFilter: OrderFilterDto,
  ): Observable<TotalDataEntity<OrderEntity[]>> {
    return this.clientProxyService.send<TotalDataEntity<OrderEntity[]>>(
      MicroserviceEnum.BillingService,
      { cmd: BillingCommandEnum.GetOrders },
      { userId, ...orderFilter },
    );
  }

  createOrder(
    userId: string,
    orderCreate: OrderCreateDto,
  ): Observable<OrderEntity> {
    return this.clientProxyService.send<OrderEntity>(
      MicroserviceEnum.BillingService,
      { cmd: BillingCommandEnum.CreateOrder },
      { userId, ...orderCreate },
    );
  }

  cancelOrder(userId: string, { orderId }: OrderDto): Observable<OrderEntity> {
    return this.clientProxyService.send<OrderEntity>(
      MicroserviceEnum.BillingService,
      { cmd: BillingCommandEnum.CancelOrder },
      { userId, orderId },
    );
  }
}
