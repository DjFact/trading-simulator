/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserLoyaltyPrizePointRepository } from '../repository/user-loyalty-prize-point.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MqService } from '../../../../common/mq/mq.service';
import { OrderEntity } from '../../../../common/entity/order.entity';
import { LoyaltyStatusEnum } from '../../../../common/enum/loyalty.enum';
import { LoyaltyException } from '../../../../common/exception/loyalty.exception';
import { Sequelize } from 'sequelize-typescript';
import { UserLoyaltyStatusRepository } from '../repository/user-loyalty-status.repository';
import { AccountEntity } from '../../../../common/entity/balance.entity';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { BillingCommandEnum } from '../../../../common/enum/billing-command.enum';
import { toFixed2Number } from '../../../../common/numbers.helper';
import { Transaction } from 'sequelize';
import { ExceptionCodeEnum } from '../../../../common/enum/exception-code.enum';
import { LoyaltyStatusRepository } from '../repository/loyalty-status.repository';
import { ClientProxyService } from '../../../../common/client-proxy/client-proxy.service';
import { QueueNameEnum } from '../../../../common/enum/queue-name.enum';
import { UserLoyaltyStatus } from '../model/user-loyalty-status.model';
import { InjectQueue } from '@nestjs/bull';
import { NOTIFY_BY_SOCKET_QUEUE } from '../../../gateway/src/websocket/processor/socket-gateway.processor';
import { Queue } from 'bull';
import { WsSocketSendEventEnum } from '../../../gateway/src/websocket/enum/ws-socket-send-event.enum';
import { RecalculatedLoyaltyStatusEntity } from '../../../../common/entity/recalculated-loyalty-status.entity';
import { instanceToPlain } from 'class-transformer';

const LOT = 10;

@Injectable()
export class UserLoyaltyStatusProcessor implements OnModuleInit {
  constructor(
    @InjectQueue(NOTIFY_BY_SOCKET_QUEUE)
    private readonly notifyBySocketQueue: Queue,
    private readonly sequelize: Sequelize,
    protected readonly mqService: MqService,
    private readonly clientProxyService: ClientProxyService,
    private readonly statusRepository: LoyaltyStatusRepository,
    private readonly userStatusRepository: UserLoyaltyStatusRepository,
    private readonly userPrizePointsRepository: UserLoyaltyPrizePointRepository,
    private readonly logger: Logger,
  ) {}

  onModuleInit() {
    this.mqService.consumeMessages<Partial<OrderEntity>>(
      QueueNameEnum.RecalculateLoyalty,
      this.processRecalculateLoyalty.bind(this),
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeExpiredUserLoyaltyPrizePoint(): Promise<void> {
    await this.userPrizePointsRepository.removeOlderThenInSec(
      360 * 24 * 60 * 60,
    );
  }

  protected async processRecalculateLoyalty(
    payload: Partial<OrderEntity>,
  ): Promise<void> {
    const { userId, ...order }: Partial<OrderEntity> = payload;

    const transaction = await this.sequelize.transaction();
    try {
      const recalculatedStatus = await this.recalculateStatus(
        userId,
        transaction,
        order,
      );

      /** send notification to user by websockets */
      await this.notifyBySocketQueue.add(
        WsSocketSendEventEnum.UpdatedLoyaltyStatus,
        instanceToPlain(recalculatedStatus),
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      if (!(e instanceof LoyaltyException)) {
        await this.mqService.sendToQueue(
          QueueNameEnum.RecalculateLoyalty as string,
          payload,
        );
        this.logger.error(e);
      }
    }
  }

  private async recalculateStatus(
    userId: string,
    transaction: Transaction,
    order?: Partial<OrderEntity>,
  ): Promise<RecalculatedLoyaltyStatusEntity> {
    const userStatus = await this.userStatusRepository.findByUserId(
      userId,
      transaction,
    );
    if (!userStatus && order) {
      const newStatus = await this.userStatusRepository.create(
        { userId: order.userId, status: LoyaltyStatusEnum.Executive },
        transaction,
      );
      return new RecalculatedLoyaltyStatusEntity(newStatus, true);
    }

    let points = userStatus.points;
    if (order) {
      if (
        userStatus.loyalty.tradeTime >
        Math.floor(
          (order.closedAt.getTime() - order.createdAt.getTime()) / 1000,
        )
      ) {
        throw new LoyaltyException(
          'Trade time not enough',
          ExceptionCodeEnum.TradeTimeNotEnough,
        );
      }

      /** calculate pricePoints based on diffPrice. it just an example */
      const pricePoints = Math.abs(order.openPrice - order.closePrice);
      if (userStatus.loyalty.pricePoints > pricePoints) {
        throw new LoyaltyException(
          'Price points not enough',
          ExceptionCodeEnum.PricePointsNotEnough,
        );
      }

      points = Math.floor(points + order.quantity / LOT);
    }

    return this.updateUserLoyaltyStatus(
      userId,
      userStatus,
      points,
      !!order,
      transaction,
    );
  }

  private async getUserDeposit(userId: string): Promise<number> {
    const balance = await this.clientProxyService.asyncSend<AccountEntity>(
      MicroserviceEnum.BillingService,
      { cmd: BillingCommandEnum.GetBalance },
      { userId },
    );
    const holdingDeposit = balance.holdings.reduce((acc, holding) => {
      return acc + holding.quantity * holding.averagePrice;
    }, 0);

    return toFixed2Number(balance.balance + holdingDeposit);
  }

  private async updateUserLoyaltyStatus(
    userId: string,
    currentStatus: UserLoyaltyStatus,
    points: number,
    isOrder: boolean,
    transaction: Transaction,
  ): Promise<RecalculatedLoyaltyStatusEntity> {
    const currentDeposit = await this.getUserDeposit(userId);

    const { rows: statuses } = await this.statusRepository.findAll(transaction);

    let newUserStatus: string;
    for (const status of statuses) {
      if (
        points >= status.points &&
        currentDeposit >= status.deposit &&
        status.name !== currentStatus.status
      ) {
        newUserStatus = status.name;
      } else {
        break;
      }
    }

    if (newUserStatus || isOrder) {
      const [cnt, [updatedStatus]] = await this.userStatusRepository.update(
        userId,
        { points, ...(newUserStatus && { status: newUserStatus }) },
        transaction,
      );

      if (cnt === 0) {
        throw new LoyaltyException(
          'User status not updated',
          ExceptionCodeEnum.UserLoyaltyStatusNotUpdated,
        );
      }
      return new RecalculatedLoyaltyStatusEntity(
        updatedStatus,
        !!newUserStatus,
      );
    }

    return new RecalculatedLoyaltyStatusEntity(currentStatus, false);
  }
}
