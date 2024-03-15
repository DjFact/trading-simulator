/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import Redis, { Cluster } from 'ioredis';
import * as yaml from 'js-yaml';
import * as winston from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from '../libs/nest-winston/winston.module';
import { utilities as nestWinstonModuleUtilities } from '../libs/nest-winston/winston.utilities';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommonConfigurationEnum } from './enum/common-configuration.enum';
import { MicroserviceEnum } from './enum/microservice.enum';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { RedisOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { SequelizeModule } from '@nestjs/sequelize';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export function getMicroserviceProvider(microType: MicroserviceEnum) {
  return {
    provide: microType,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      ClientProxyFactory.create({
        transport: Transport.REDIS,
        options: configService.get('redis'),
      } as RedisOptions),
  };
}

export function getWinstonLoggerModule() {
  return WinstonModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      exitOnError: false,
      handleExceptions: false,
      transports: [
        new winston.transports.Console({
          ...configService.get(CommonConfigurationEnum.LoggerConsole),
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            winston.format.metadata(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
    inject: [ConfigService],
  });
}

export function getSequelizeModuleRoot() {
  return SequelizeModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) =>
      Object.assign({}, configService.get('db'), {
        dialect: 'postgresql',
        autoLoadModels: true,
        synchronize: true,
        models: ['*.model.ts'],
        logging: true,
        pool: {
          max: 50,
        },
      }),
  });
}

export function getConfigModule(name: string) {
  name = name.split('_')[0].toLowerCase();
  const configuration = () => {
    const YAML_CONFIG_FILENAME = process.env.NODE_ENV + '.config.yml';
    return yaml.load(
      readFileSync(
        join(`${process.cwd()}/config/${name}`, YAML_CONFIG_FILENAME),
        'utf8',
      ),
    );
  };

  return ConfigModule.forRoot({
    envFilePath: resolve(`${process.cwd()}/config/${name}`, '.env'),
    load: [configuration],
  });
}

export function getRedis() {
  return RedisModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
      configService: ConfigService,
    ): Promise<RedisModuleOptions> => ({
      config: configService.get(CommonConfigurationEnum.Redis),
    }),
  });
}

export function getThrottlerModule() {
  const defaultThrottle = {
    ttl: 60,
    limit: 20,
  };

  return ThrottlerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      Object.assign(
        defaultThrottle,
        configService.get(CommonConfigurationEnum.Throttle) || {},
      ),
  });
}

export function createRedisClient(
  configService: ConfigService,
  prefix?: string,
): Redis | Cluster {
  const opts = { enableReadyCheck: false, maxRetriesPerRequest: null };
  const redis = configService.get(CommonConfigurationEnum.Redis);
  if (redis) {
    return new Redis({ ...redis, prefix, ...opts });
  }

  const redisCluster = configService.get(CommonConfigurationEnum.RedisCluster);
  if (redisCluster.options?.redisOptions?.tls) {
    redisCluster.options.redisOptions.tls = {};
    redisCluster.options.slotsRefreshTimeout = 2000;
    redisCluster.options.dnsLookup = (address, callback) =>
      callback(null, address);
  }

  return new Redis.Cluster(redisCluster.nodes, {
    ...(redisCluster.options || opts),
  });
}

export function getHttpModule() {
  return HttpModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) =>
      configService.get('http'),
    inject: [ConfigService],
  });
}

export function getBullModuleRoot(prefix?: string) {
  return BullModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      createClient: () => createRedisClient(configService, prefix),
    }),
  });
}

export function registerBullQueue(queueName: string, configName?: string) {
  const defaultJobOptions = {
    removeOnComplete: true,
    removeOnFail: true,
  };

  return BullModule.registerQueueAsync({
    name: queueName,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      defaultJobOptions: Object.assign(
        defaultJobOptions,
        configService.get(configName) || {},
      ),
    }),
  });
}

export function getCacheModule(ttl?: number) {
  return CacheModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      store: redisStore,
      socket: configService.get('redis'),
      ttl: ttl || configService.get('cache.ttl'),
    }),
    inject: [ConfigService],
  });
}
