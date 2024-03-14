import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthCommandEnum } from '../../../../common/enum/auth-command.enum';
import { UserEntity } from '../../../../common/entity/user.entity';
import { DateFilterDto } from '../../../../common/dto/date-filter.dto';
import { UpdateUserDto } from '../../../../common/dto/update-user.dto';
import { CreateUserDto } from '../../../../common/dto/create-user.dto';
import { SignInDto } from '../../../../common/dto/signin.dto';
import { IdParam } from '../../../../common/param/id.param';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @MessagePattern({ cmd: AuthCommandEnum.GetAllUsers })
  findAll(@Payload() payload: DateFilterDto) {
    return this.usersService.findAll(payload);
  }

  @MessagePattern({ cmd: AuthCommandEnum.GetUser })
  findOne(@Payload() payload: IdParam): Promise<UserEntity> {
    return this.usersService.getById(payload.id);
  }

  @MessagePattern({ cmd: AuthCommandEnum.UpdateUser })
  update(@Payload() payload: UpdateUserDto & IdParam): Promise<UserEntity> {
    const { id, ...updateUserDto } = payload;
    return this.usersService.updateById(id, updateUserDto);
  }

  @MessagePattern({ cmd: AuthCommandEnum.CreateUser })
  create(@Payload() payload: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(payload);
  }

  @MessagePattern({ cmd: AuthCommandEnum.GetByLoginAndPassword })
  findByLoginAndPassword(@Payload() payload: SignInDto): Promise<UserEntity> {
    return this.usersService.findByLoginAndPassword(payload);
  }
}
