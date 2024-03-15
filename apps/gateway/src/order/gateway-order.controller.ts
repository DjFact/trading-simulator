import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GatewayOrderService } from './gateway-order.service';
import { ResponseInterceptor } from '../../../../common/interfceptor/response.interceptor';
import { AuthGuard } from '../../../../common/guard/auth.guard';
import { UserSession } from '../user-session.decorator';
import { UserEntity } from '../../../../common/entity/user.entity';
import { Observable } from 'rxjs';
import { TotalDataEntity } from '../../../../common/entity/total-data.entity';
import { ApiOkResponseCustom } from '../../../../common/swagger/response.schema';
import { OrderEntity } from '../../../../common/entity/order.entity';
import { OrderFilterDto } from '../../../../common/dto/order-filter.dto';
import { OrderCreateDto } from '../../../../common/dto/order-create.dto';
import { OrderDto } from '../../../../common/dto/order.dto';

@ApiBearerAuth()
@ApiTags('Order Gateway Service')
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('api/order')
export class GatewayOrderController {
  constructor(private readonly orderService: GatewayOrderService) {}

  @ApiOperation({ summary: 'Get all orders of the current user' })
  @ApiOkResponseCustom(TotalDataEntity, 200, OrderEntity)
  @Get()
  getOrders(
    @UserSession() user: UserEntity,
    @Query() query: OrderFilterDto,
  ): Observable<TotalDataEntity<OrderEntity[]>> {
    return this.orderService.getAll(user.id, query);
  }

  @ApiOperation({ summary: 'Create new order for the current user' })
  @ApiOkResponseCustom(OrderEntity, 201)
  @Post()
  createOrder(
    @UserSession() user: UserEntity,
    @Body() orderCreate: OrderCreateDto,
  ): Observable<OrderEntity> {
    return this.orderService.createOrder(user.id, orderCreate);
  }

  @ApiOperation({ summary: 'Cancel order of the current user' })
  @ApiOkResponseCustom(OrderEntity, 201)
  @Post('cancel')
  cancelOrder(
    @UserSession() user: UserEntity,
    @Body() order: OrderDto,
  ): Observable<OrderEntity> {
    return this.orderService.cancelOrder(user.id, order);
  }
}
