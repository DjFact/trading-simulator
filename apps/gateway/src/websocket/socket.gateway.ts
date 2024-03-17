/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17.03.2024 12:04
 */
import {
  ClassSerializerInterceptor,
  Logger,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsThrottlerGuard } from './guard/ws-throttler.guard';
import { WsAuthGuard } from './guard/ws-auth.guard';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WsAuthService } from './ws-auth.service';
import { SocketGatewayService } from './socket-gateway.service';
import { BaseGateway, SocketWithSession } from './base.gateway';
import { WsResponseInterceptor } from '../../../../common/ws-server/ws-response.interceptor';
import { WsNamespaceEnum } from '../../../../common/ws-server/enum/ws-namespace.enum';
import { WsSocketEventEnum } from './enum/ws-socket-event.enum';
import { LoyaltyPrizeDto } from '../../../../common/dto/loyalty-prize.dto';
import { Observable } from 'rxjs';
import { UserLoyaltyOrderEntity } from '../../../../common/entity/user-loyalty-order.entity';
import { UserLoyaltyStatusEntity } from '../../../../common/entity/user-loyalty-status.entity';

@UseInterceptors(WsResponseInterceptor, ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(WsThrottlerGuard, WsAuthGuard)
@WebSocketGateway({ namespace: WsNamespaceEnum.Trading })
export class SocketGateway extends BaseGateway {
  constructor(
    readonly wsAuthService: WsAuthService,
    readonly gatewayService: SocketGatewayService,
    readonly logger: Logger,
  ) {
    super(wsAuthService, gatewayService, logger);
  }

  @SubscribeMessage(WsSocketEventEnum.GetLoyaltyStatus)
  getLoyaltyStatus(
    @ConnectedSocket() socket: SocketWithSession,
  ): Observable<UserLoyaltyStatusEntity> {
    return this.gatewayService.getLoyaltyStatus(socket.user.id);
  }

  @SubscribeMessage(WsSocketEventEnum.CreateLoyaltyPrizeOrder)
  createLoyaltyPrizeOrder(
    @ConnectedSocket() socket: SocketWithSession,
    @MessageBody() { id }: LoyaltyPrizeDto,
  ): Observable<UserLoyaltyOrderEntity> {
    return this.gatewayService.createLoyaltyPrizeOrder(
      socket.user.id,
      id,
      socket.user.country,
    );
  }
}
