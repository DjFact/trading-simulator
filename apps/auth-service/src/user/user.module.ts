import { Logger, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserRepository } from './user.repository';
import { ClientProxyModule } from '../../../../common/client-proxy/client-proxy.module';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User]),
    ClientProxyModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, Logger],
  exports: [UserService],
})
export class UserModule {}
