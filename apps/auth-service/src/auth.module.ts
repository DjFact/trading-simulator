import { Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HealthModule } from './health/health.module';
import {
  getConfigModule,
  getSequelizeModuleRoot,
  getThrottlerModule,
  getWinstonLoggerModule,
} from '../../../common/module.utils';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { MicroserviceEnum } from '../../../common/enum/microservice.enum';
import { MicroserviceAllExceptionFilter } from '../../../common/filter/microservice-all.exception.filter';
import { ErrorMicroserviceInterceptor } from '../../../common/interfceptor/error-microservice.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthSystemService } from './auth-system.service';
import { Sequelize } from 'sequelize-typescript';

@Module({
  imports: [
    getConfigModule(MicroserviceEnum.AuthService),
    getSequelizeModuleRoot(),
    getWinstonLoggerModule(),
    getThrottlerModule(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('jwt.accessExpiresIn') },
      }),
    }),
    UserModule,
    OtpModule,
    HealthModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthSystemService,
    ErrorMicroserviceInterceptor,
    MicroserviceAllExceptionFilter,
    Logger,
  ],
})
export class AuthModule implements OnModuleDestroy {
  constructor(private readonly sequelize: Sequelize) {}

  async onModuleDestroy(): Promise<void> {
    await this.sequelize.close();
  }
}
