import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { AuthModule } from '../src/auth.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { getConfigModule, getRedisOptions } from '../../../common/module.utils';
import { MicroserviceEnum } from '../../../common/enum/microservice.enum';
import { ConfigService } from '@nestjs/config';
import { AuthCommandEnum } from '../../../common/enum/auth-command.enum';
import { AuthSystemService } from '../src/auth-system.service';
import { UserProxy } from '../src/user/user.proxy';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { lastValueFrom, of } from 'rxjs';
import { ClientProxyService } from '../../../common/client-proxy/client-proxy.service';
import { SignUpDto } from '../../../common/dto/signup.dto';
import { OtpService } from '../src/otp/otp.service';
import { UserService } from '../src/user/user.service';

describe('AuthController (e2e)', () => {
  let app: INestMicroservice;
  let configService: ConfigService;
  let clientProxy: ClientProxy;

  beforeAll(async () => {
    const context = await NestFactory.createApplicationContext(
      getConfigModule(MicroserviceEnum.AuthService),
    );
    configService = context.get(ConfigService);

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(UserProxy)
      .useValue({
        createUserAccount: jest.fn(() => Promise.resolve()),
      })
      .overrideProvider(ClientProxyService)
      .useValue({
        send: jest.fn(() => of({})),
        asyncSend: jest.fn(() => Promise.resolve({})),
        emit: jest.fn(),
      })
      .overrideProvider(OtpService)
      .useValue({
        checkOtp: jest.fn(() => Promise.resolve(true)),
      })
      .compile();

    app = moduleRef.createNestMicroservice({
      transport: Transport.REDIS,
      options: getRedisOptions(configService),
    });
    clientProxy = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: getRedisOptions(configService),
    });
    const authSystemService = app.get(AuthSystemService);
    await authSystemService.createAdminUser();

    app.enableShutdownHooks();
    await app.listen();
  });

  describe('SignIn', () => {
    it('should handle sign in for admin', async () => {
      const response = await lastValueFrom(
        clientProxy.send(
          { cmd: AuthCommandEnum.Authentication },
          configService.get('admin'),
        ),
      );

      expect(response).toBeDefined();

      expect(response).toHaveProperty('user');
      expectUserEntity(response.user);
      expect(response).toHaveProperty('access_token');
      expect(response).toHaveProperty('refresh_token');
    });

    it('should throw an invalid password exception', async () => {
      try {
        await lastValueFrom(
          clientProxy.send(
            { cmd: AuthCommandEnum.Authentication },
            { ...configService.get('admin'), password: 'invalid' },
          ),
        );
      } catch (e) {
        expect(e).toHaveProperty('error', 'Invalid password');
        expect(e).toHaveProperty('code', 1011);
      }
    });
  });

  describe('Operations with tokens', () => {
    it('should handle authorization by access token', async () => {
      const { access_token } = await lastValueFrom(
        clientProxy.send(
          { cmd: AuthCommandEnum.Authentication },
          configService.get('admin'),
        ),
      );
      const response = await lastValueFrom(
        clientProxy.send(
          { cmd: AuthCommandEnum.Authorization },
          { accessToken: access_token },
        ),
      );

      expect(response).toBeDefined();
      expectUserEntity(response);
    });

    it('should handle refresh token', async () => {
      const { refresh_token } = await lastValueFrom(
        clientProxy.send(
          { cmd: AuthCommandEnum.Authentication },
          configService.get('admin'),
        ),
      );
      const response = await lastValueFrom(
        clientProxy.send(
          { cmd: AuthCommandEnum.RefreshToken },
          { refreshToken: refresh_token },
        ),
      );

      expect(response).toBeDefined();
    });
  });

  describe('Sign Up', () => {
    it('should handle sign up for user', async () => {
      const user: SignUpDto = {
        name: 'User',
        email: 'user@gmail.com',
        password: 'password',
        code: '123456',
      };
      const userService: UserService = app.get(UserService);
      await userService.deleteByEmail(user.email);

      const response = await lastValueFrom(
        clientProxy.send({ cmd: AuthCommandEnum.SignUp }, user),
      );

      expect(response).toBeDefined();
      expect(response).toHaveProperty('user');
      expectUserEntity(response.user);
      expect(response).toHaveProperty('access_token');
      expect(response).toHaveProperty('refresh_token');
    });
  });
});

function expectUserEntity(response: any) {
  expect(response).toHaveProperty('id');
  expect(response).toHaveProperty('name');
  expect(response).toHaveProperty('email');
  expect(response).toHaveProperty('role');
  expect(response).toHaveProperty('country');
  expect(response).toHaveProperty('phone');
  expect(response).toHaveProperty('createdAt');
  expect(response).toHaveProperty('updatedAt');
}
