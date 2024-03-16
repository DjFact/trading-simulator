import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GatewayLoyaltyStatusService } from './gateway-loyalty-status.service';
import { ResponseInterceptor } from '../../../../../common/interfceptor/response.interceptor';
import { AuthGuard } from '../../../../../common/guard/auth.guard';
import { TotalDataEntity } from '../../../../../common/entity/total-data.entity';
import { LoyaltyStatusEntity } from '../../../../../common/entity/loyalty-status.entity';
import { LoyaltyStatusCreateDto } from '../../../../../common/dto/loyalty-status-create.dto';
import { LoyaltyStatusUpdateDto } from '../../../../../common/dto/loyalty-status-update.dto';
import { LoyaltyStatusDto } from '../../../../../common/dto/loyalty-status.dto';
import { ApiOkResponseCustom } from '../../../../../common/swagger/response.schema';
import { Observable } from 'rxjs';

@ApiBearerAuth()
@ApiTags('Loyalty Gateway Status Service')
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('api/loyalty/status')
export class GatewayLoyaltyStatusController {
  constructor(private readonly statusService: GatewayLoyaltyStatusService) {}

  @ApiOperation({ summary: 'Get all loyalty statuses' })
  @ApiOkResponseCustom(TotalDataEntity, 200, LoyaltyStatusEntity)
  @Get()
  getAllStatuses(): Observable<TotalDataEntity<LoyaltyStatusEntity[]>> {
    return this.statusService.getAllStatuses();
  }

  @ApiOperation({ summary: 'Create new loyalty status' })
  @ApiOkResponseCustom(LoyaltyStatusEntity, 201)
  @Post()
  createStatus(
    @Body() status: LoyaltyStatusCreateDto,
  ): Observable<LoyaltyStatusEntity> {
    return this.statusService.createStatus(status);
  }

  @ApiOperation({ summary: 'Update loyalty status' })
  @ApiOkResponseCustom(LoyaltyStatusEntity, 200)
  @Put(':name')
  updateStatus(
    @Param() { name }: LoyaltyStatusDto,
    @Body() status: LoyaltyStatusUpdateDto,
  ): Observable<LoyaltyStatusEntity> {
    return this.statusService.updateStatus(name, status);
  }

  @ApiOperation({ summary: 'Delete loyalty status' })
  @ApiOkResponseCustom(LoyaltyStatusEntity, 200)
  @Delete(':name')
  deleteStatus(@Param() { name }: LoyaltyStatusDto): Observable<boolean> {
    return this.statusService.deleteStatus(name);
  }
}
