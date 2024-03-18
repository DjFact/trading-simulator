import { Logger, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserRepository } from './user.repository';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';
import { UserProxy } from './user.proxy';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User]),
    ClientProxyModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserProxy, UserRepository, Logger],
  exports: [UserService, UserProxy],
})
export class UserModule {}
