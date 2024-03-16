import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GatewayLoyaltyPrizeService } from './gateway-loyalty-prize.service';
import { ResponseInterceptor } from '../../../../../common/interfceptor/response.interceptor';
import { AuthGuard } from '../../../../../common/guard/auth.guard';
import { ApiOkResponseCustom } from '../../../../../common/swagger/response.schema';
import { UserSession } from '../../user-session.decorator';
import { UserEntity } from '../../../../../common/entity/user.entity';
import { LoyaltyPrizeFilterDto } from '../../../../../common/dto/loyalty-prize-filter.dto';
import { TotalDataEntity } from '../../../../../common/entity/total-data.entity';
import { LoyaltyPrizeEntity } from '../../../../../common/entity/loyalty-prize.entity';
import { LoyaltyPrizeCreateDto } from '../../../../../common/dto/loyalty-prize-create.dto';
import { LoyaltyPrizeUpdateDto } from '../../../../../common/dto/loyalty-prize-update.dto';
import { LoyaltyPrizeDto } from '../../../../../common/dto/loyalty-prize.dto';
import { Observable } from 'rxjs';

@ApiBearerAuth()
@ApiTags('Loyalty Gateway Prize Service')
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('api/loyalty/prize')
export class GatewayLoyaltyPrizeController {
  constructor(private readonly prizeService: GatewayLoyaltyPrizeService) {}

  @ApiOperation({ summary: 'Get all loyalty prizes' })
  @ApiOkResponseCustom(TotalDataEntity, 200, LoyaltyPrizeEntity)
  @Get()
  getAllPrizes(
    @UserSession() user: UserEntity,
    @Query() prize: LoyaltyPrizeFilterDto,
  ): Observable<TotalDataEntity<LoyaltyPrizeEntity[]>> {
    return this.prizeService.getAllPrizes(prize);
  }

  @ApiOperation({ summary: 'Create loyalty prize' })
  @ApiOkResponseCustom(LoyaltyPrizeEntity, 201)
  @Post()
  createPrize(
    @Body() prize: LoyaltyPrizeCreateDto,
  ): Observable<LoyaltyPrizeEntity> {
    return this.prizeService.createPrize(prize);
  }

  @ApiOperation({ summary: 'Update loyalty prize' })
  @ApiOkResponseCustom(LoyaltyPrizeEntity, 200)
  @Put(':id')
  updatePrize(
    @Param() { id }: LoyaltyPrizeDto,
    @Body() prize: LoyaltyPrizeUpdateDto,
  ): Observable<LoyaltyPrizeEntity> {
    return this.prizeService.updatePrize(id, prize);
  }

  @ApiOperation({ summary: 'Delete loyalty prize' })
  @ApiOkResponseCustom(LoyaltyPrizeEntity, 200)
  @Delete(':id')
  deletePrize(@Param() prize: LoyaltyPrizeDto): Observable<boolean> {
    return this.prizeService.deletePrize(prize);
  }
}
