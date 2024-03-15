/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxyService } from '../../../../common/client-proxy/client-proxy.service';
import { DateFilterDto } from '../../../../common/dto/date-filter.dto';
import { TotalDataEntity } from '../../../../common/entity/total-data.entity';
import { UserEntity } from '../../../../common/entity/user.entity';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { AuthCommandEnum } from '../../../../common/enum/auth-command.enum';
import { UpdateUserDto } from '../../../../common/dto/update-user.dto';

@Injectable()
export class GatewayUserService {
  constructor(protected readonly clientProxyService: ClientProxyService) {}

  getAll(userFilter: DateFilterDto): Observable<TotalDataEntity<UserEntity[]>> {
    return this.clientProxyService.send<TotalDataEntity<UserEntity[]>>(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.GetAllUsers },
      userFilter,
    );
  }

  getOne(id: string): Observable<UserEntity> {
    return this.clientProxyService.send<UserEntity>(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.GetUser },
      { id },
    );
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): Observable<UserEntity> {
    return this.clientProxyService.send<UserEntity>(
      MicroserviceEnum.AuthService,
      { cmd: AuthCommandEnum.UpdateUser },
      { id, ...updateUserDto },
    );
  }
}
