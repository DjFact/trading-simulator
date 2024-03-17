/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 17.03.2024 11:38
 */
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { WsSocketSendEventEnum } from '../enum/ws-socket-send-event.enum';
import { WsInstance } from '../../../../../common/ws-server/ws.instance';
import { WsNamespaceEnum } from '../../../../../common/ws-server/enum/ws-namespace.enum';
import { RecalculatedLoyaltyStatusEntity } from '../../../../../common/entity/recalculated-loyalty-status.entity';
import { OrderEntity } from '../../../../../common/entity/order.entity';

export const NOTIFY_BY_SOCKET_QUEUE = 'notifyBySocketQueue';

@Processor(NOTIFY_BY_SOCKET_QUEUE)
export class SocketGatewayProcessor {
  constructor(
    private readonly wsInstance: WsInstance,
    private readonly logger: Logger,
  ) {}

  @OnQueueFailed()
  onError(job: Job, error: any) {
    this.logger.error(`NOTIFY_BY_SOCKET_QUEUE job failed`, { job, error });
  }

  @Process(WsSocketSendEventEnum.OrderCompleted)
  backgroundStepCompleted(job: Job<OrderEntity>) {
    this.sendToBrowser(
      WsSocketSendEventEnum.OrderCompleted,
      job.data.userId,
      job.data,
    );
  }

  @Process(WsSocketSendEventEnum.UpdatedLoyaltyStatus)
  updatedLoyaltyStatus(job: Job<RecalculatedLoyaltyStatusEntity>) {
    this.sendToBrowser(
      WsSocketSendEventEnum.UpdatedLoyaltyStatus,
      job.data.status.userId,
      job.data,
    );
  }

  private sendToBrowser(
    event: WsSocketSendEventEnum,
    userId: string,
    entity: object,
  ): boolean {
    return this.wsInstance
      .getServer()
      .of(WsNamespaceEnum.Trading)
      .to(userId)
      .emit(event, entity);
  }
}
