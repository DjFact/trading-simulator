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
import { ConsumeMessage } from 'amqplib';
import { ChannelWrapper } from 'amqp-connection-manager';
import { UserLoyaltyStatusEntity } from '../../../../common/entity/user-loyalty-status.entity';
import { UserLoyaltyStatus } from '../model/user-loyalty-status.model';

const LOT = 10;

@Injectable()
export class UserLoyaltyStatusSystemService implements OnModuleInit {
  constructor(
    private readonly sequelize: Sequelize,
    protected readonly mqService: MqService,
    private readonly clientProxyService: ClientProxyService,
    private readonly statusRepository: LoyaltyStatusRepository,
    private readonly userStatusRepository: UserLoyaltyStatusRepository,
    private readonly userPrizePointsRepository: UserLoyaltyPrizePointRepository,
    private readonly logger: Logger,
  ) {}

  onModuleInit() {
    this.mqService.consumeMessages(
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
    msg: ConsumeMessage,
    channel: ChannelWrapper,
  ): Promise<void> {
    const payload = JSON.parse(msg.content.toString());
    const { userId, ...order }: Partial<OrderEntity> = payload;

    const transaction = await this.sequelize.transaction();
    try {
      const [status, isNew] = await this.recalculateStatus(
        userId,
        transaction,
        order,
      );
      await transaction.commit();
      /** todo: send notification to user (if status -> changed status) */
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

    channel.ack(msg);
  }

  private async recalculateStatus(
    userId: string,
    transaction: Transaction,
    order?: Partial<OrderEntity>,
  ): Promise<[UserLoyaltyStatusEntity, boolean]> {
    const userStatus = await this.userStatusRepository.findByUserId(
      userId,
      transaction,
    );
    if (!userStatus && order) {
      const newStatus = await this.userStatusRepository.create(
        { userId: order.userId, status: LoyaltyStatusEnum.Executive },
        transaction,
      );
      return [new UserLoyaltyStatusEntity(newStatus), true];
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
  ): Promise<[UserLoyaltyStatusEntity, boolean]> {
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
      return [new UserLoyaltyStatusEntity(updatedStatus), !!newUserStatus];
    }

    return [new UserLoyaltyStatusEntity(currentStatus), false];
  }
}
