import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GatewayLoyaltyUserStatusService } from './gateway-loyalty-user-status.service';
import { UserLoyaltyStatusEntity } from '../../../../../common/entity/user-loyalty-status.entity';
import { LoyaltyPrizeDto } from '../../../../../common/dto/loyalty-prize.dto';
import { UserLoyaltyOrderEntity } from '../../../../../common/entity/user-loyalty-order.entity';
import { ApiOkResponseCustom } from '../../../../../common/swagger/response.schema';
import { AuthGuard } from '../../../../../common/guard/auth.guard';
import { ResponseInterceptor } from '../../../../../common/interfceptor/response.interceptor';
import { UserSession } from '../../user-session.decorator';
import { UserEntity } from '../../../../../common/entity/user.entity';
import { Observable } from 'rxjs';

@ApiBearerAuth()
@ApiTags('Loyalty Gateway User Status Service')
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('api/loyalty/user')
export class GatewayLoyaltyUserStatusController {
  constructor(
    private readonly userStatusService: GatewayLoyaltyUserStatusService,
  ) {}

  @ApiOperation({ summary: 'Get loyalty status of the current user' })
  @ApiOkResponseCustom(UserLoyaltyStatusEntity, 200)
  @Get('status')
  getStatus(
    @UserSession() user: UserEntity,
  ): Observable<UserLoyaltyStatusEntity> {
    return this.userStatusService.getStatus(user.id);
  }

  @ApiOperation({ summary: 'Create loyalty prize order for current user' })
  @ApiOkResponseCustom(UserLoyaltyOrderEntity, 201)
  @Post('order')
  makePrizeOrder(
    @UserSession() user: UserEntity,
    @Body() prizeOrder: LoyaltyPrizeDto,
  ): Observable<UserLoyaltyOrderEntity> {
    return this.userStatusService.makePrizeOrder(
      user.id,
      prizeOrder.id,
      user.country,
    );
  }
}
