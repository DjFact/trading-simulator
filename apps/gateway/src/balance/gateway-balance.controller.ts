import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GatewayBalanceService } from './gateway-balance.service';
import { ResponseInterceptor } from '../../../../common/interfceptor/response.interceptor';
import { UpdateUserDto } from '../../../../common/dto/update-user.dto';
import { AuthGuard } from '../../../../common/guard/auth.guard';
import { UserSession } from '../user-session.decorator';
import { UserEntity } from '../../../../common/entity/user.entity';
import { ApiOkResponseCustom } from '../../../../common/swagger/response.schema';
import { AccountEntity } from '../../../../common/entity/balance.entity';
import { TopUpDto } from '../../../../common/dto/top-up.dto';

@ApiBearerAuth()
@ApiTags('Balance Gateway Service')
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('api/balance')
export class GatewayBalanceController {
  constructor(private readonly balanceService: GatewayBalanceService) {}

  @ApiOperation({ summary: 'Get balance of the current user' })
  @ApiOkResponseCustom(AccountEntity, 200)
  @Get()
  getBalance(@UserSession() user: UserEntity) {
    return this.balanceService.getBalance(user.id);
  }

  @ApiOperation({ summary: 'TopUp balance for current user' })
  @ApiOkResponseCustom(AccountEntity, 201)
  @Post()
  topUp(@UserSession() user: UserEntity, @Body() topUpDto: TopUpDto) {
    return this.balanceService.topUp(user.id, topUpDto);
  }
}
