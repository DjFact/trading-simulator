/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */

import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Observable, timeout, lastValueFrom, defaultIfEmpty } from 'rxjs';
import { ModuleRef } from '@nestjs/core';
import { MicroserviceException } from '../exception/microservice.exception';
import { ExceptionCodeEnum } from '../enum/exception-code.enum';
import { MicroserviceEnum } from '../enum/microservice.enum';

const DEFAULT_TIMEOUT = 10000;

@Injectable()
export class ClientProxyService {
  private readonly clientMap: Map<MicroserviceEnum, ClientProxy>;
  constructor(
    private moduleRef: ModuleRef,
    private readonly configService: ConfigService,
  ) {
    this.clientMap = new Map<MicroserviceEnum, ClientProxy>();
  }

  private getClient(clientType: MicroserviceEnum): ClientProxy {
    if (!Object.values(MicroserviceEnum).includes(clientType)) {
      throw new MicroserviceException(
        'Unknown client type',
        ExceptionCodeEnum.UnknownClientType,
      );
    }

    let client = this.clientMap.get(clientType);
    if (!client) {
      client = this.moduleRef.get(clientType);
      this.clientMap.set(clientType, client);
    }

    return client;
  }

  public send<TResult = any, TInput = any>(
    clientType: MicroserviceEnum,
    pattern: any,
    data: TInput,
    timeoutMs?: number,
  ): Observable<any> {
    return this.getClient(clientType)
      .send<TResult, TInput>(pattern, data)
      .pipe(
        timeout(
          timeoutMs ||
            this.configService.get('microservice.timeout') ||
            DEFAULT_TIMEOUT,
        ),
      );
  }

  public asyncSend<TResult = any, TInput = any>(
    clientType: MicroserviceEnum,
    pattern: any,
    data: TInput,
    timeoutMs?: number,
  ): Promise<TResult> {
    return lastValueFrom(
      this.send<TResult, TInput>(clientType, pattern, data, timeoutMs).pipe(
        defaultIfEmpty([]),
      ),
    );
  }

  public emit<TResult = any, TInput = any>(
    clientType: MicroserviceEnum,
    pattern: any,
    data: TInput,
  ): Observable<TResult> {
    return this.getClient(clientType)
      .emit(pattern, data)
      .pipe(
        timeout(
          this.configService.get('microservice.timeout') || DEFAULT_TIMEOUT,
        ),
      );
  }

  public asyncEmit<TResult = any, TInput = any>(
    clientType: MicroserviceEnum,
    pattern: any,
    data: TInput,
  ): Promise<TResult> {
    return lastValueFrom(this.emit<TResult, TInput>(clientType, pattern, data));
  }
}
