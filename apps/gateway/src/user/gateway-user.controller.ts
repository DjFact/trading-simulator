import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GatewayUserService } from './gateway-user.service';
import { ResponseInterceptor } from '../../../../common/interfceptor/response.interceptor';
import { DateFilterDto } from '../../../../common/dto/date-filter.dto';
import { UpdateUserDto } from '../../../../common/dto/update-user.dto';
import { AuthGuard } from '../../../../common/guard/auth.guard';
import { UserSession } from '../user-session.decorator';
import { UserEntity } from '../../../../common/entity/user.entity';
import { Observable } from 'rxjs';
import { TotalDataEntity } from '../../../../common/entity/total-data.entity';
import { ApiOkResponseCustom } from '../../../../common/swagger/response.schema';
import { Roles } from '../../../../common/roles.decorator';
import { UserRoleEnum } from '../../../../common/enum/user-role.enum';

@ApiBearerAuth()
@ApiTags('User Gateway Service')
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('api/user')
export class GatewayUserController {
  constructor(private readonly userService: GatewayUserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponseCustom(TotalDataEntity, 200, UserEntity)
  @Roles({ enum: [UserRoleEnum.Admin] })
  @Get('all')
  findAll(
    @UserSession() user: UserEntity,
    @Query() query: DateFilterDto,
  ): Observable<TotalDataEntity<UserEntity[]>> {
    return this.userService.getAll(query);
  }

  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponseCustom(UserEntity, 200)
  @Get()
  findOne(@UserSession() user: UserEntity) {
    return this.userService.getOne(user.id);
  }

  @ApiOperation({
    summary: 'Update current user',
  })
  @ApiOkResponseCustom(UserEntity, 200)
  @Put()
  update(
    @UserSession() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(user.id, updateUserDto);
  }
}
