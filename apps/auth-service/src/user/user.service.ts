import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.model';
import { UserException } from '../../../../common/exception/user.exception';
import { ExceptionCodeEnum } from '../../../../common/enum/exception-code.enum';
import { UserEntity } from '../../../../common/entity/user.entity';
import { SignInDto } from '../../../../common/dto/signin.dto';
import { CreateUserDto } from '../../../../common/dto/create-user.dto';
import { TotalDataEntity } from '../../../../common/entity/total-data.entity';
import { DateFilterDto } from '../../../../common/dto/date-filter.dto';
import { UserRepository } from './user.repository';
import { UpdateUserFullDto } from '../../../../common/dto/update-user-full.dto';
import { Sequelize } from 'sequelize-typescript';
import { UserProxy } from './user.proxy';

@Injectable()
export class UserService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly userProxy: UserProxy,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly logger: Logger,
  ) {}

  async updateById(
    id: string,
    updateDto: UpdateUserFullDto,
  ): Promise<UserEntity> {
    let newPassword: string;
    if (updateDto.password) {
      newPassword =
        updateDto.password + this.configService.get<string>('APP_CRYPT_SALT');
    }

    const [cnt, [user]] = await this.userRepository.updateById(id, {
      ...updateDto,
      ...(newPassword && { password: newPassword }),
    } as User);
    if (!cnt) {
      throw new UserException(
        `User with id '${id}' not found`,
        ExceptionCodeEnum.UserNotFound,
        { id },
      );
    }

    return new UserEntity(user);
  }

  async findByLoginAndPassword({
    email,
    password,
  }: SignInDto): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);
    if (null === user) {
      throw new UserException(
        `User with login credential "${email}" not found.`,
        ExceptionCodeEnum.UserWrongCredentials,
        { email },
      );
    }

    if (
      await user.comparePassword(
        password + this.configService.get<string>('APP_CRYPT_SALT'),
      )
    ) {
      return new UserEntity(user);
    }

    throw new UserException(
      'Invalid password',
      ExceptionCodeEnum.UserWrongCredentials,
      { email },
    );
  }

  async findAll(filter: DateFilterDto): Promise<TotalDataEntity<UserEntity[]>> {
    const { rows, count } = await this.userRepository.findAll(filter);

    const data = rows.map((user) => new UserEntity(user));
    return new TotalDataEntity(data, count);
  }

  async getById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (null === user) {
      throw new UserException(
        `Users with id ${id} not found!`,
        ExceptionCodeEnum.UserNotFound,
        { id },
      );
    }

    return new UserEntity(user);
  }

  async create(createDto: CreateUserDto): Promise<UserEntity> {
    const { password, ...userDto } = createDto;
    const userData = Object.assign({}, userDto, {
      password: password + this.configService.get<string>('APP_CRYPT_SALT'),
    }) as User;

    const transaction = await this.sequelize.transaction();

    const check = await this.userRepository.findByEmail(
      userData.email,
      transaction,
    );
    if (check) {
      throw new UserException(
        `User with email ${userData.email} already exists`,
        ExceptionCodeEnum.UserAlreadyExists,
      );
    }

    try {
      const createdUser = await this.userRepository.create(
        userData,
        transaction,
      );

      await this.userProxy.createUserAccount(createdUser.id);

      await transaction.commit();

      return new UserEntity(createdUser);
    } catch (e) {
      await transaction.rollback();

      this.logger.error(`Create user failed with error: ${e.message}`);

      throw new UserException(
        `Create user failed with error: ${e.message}`,
        ExceptionCodeEnum.UserCreationError,
        userDto,
      );
    }
  }

  async deleteByEmail(email: string): Promise<boolean> {
    const cnt = await this.userRepository.deleteByEmail(email);
    if (!cnt) {
      throw new UserException(
        `User with email '${email}' not found`,
        ExceptionCodeEnum.UserNotFound,
        { email },
      );
    }
    return true;
  }
}
