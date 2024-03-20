/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15/03/2024 23:34
 */
import { Injectable, Logger } from '@nestjs/common';
import { UserLoyaltyStatusRepository } from '../repository/user-loyalty-status.repository';
import { UserLoyaltyStatusEntity } from '../../../../common/entity/user-loyalty-status.entity';
import { LoyaltyException } from '../../../../common/exception/loyalty.exception';
import { ExceptionCodeEnum } from '../../../../common/enum/exception-code.enum';
import { UserLoyaltyOrderRepository } from '../repository/user-loyalty-order.repository';
import { LoyaltyPrizeRepository } from '../repository/loyalty-prize.repository';
import { Sequelize } from 'sequelize-typescript';
import { UserLoyaltyPrizePointRepository } from '../repository/user-loyalty-prize-point.repository';
import { OrderStatusEnum } from '../../../../common/enum/order-status.enum';
import { UserLoyaltyOrderEntity } from '../../../../common/entity/user-loyalty-order.entity';
import { Transaction } from 'sequelize';
import { LoyaltyPrizeEntity } from '../../../../common/entity/loyalty-prize.entity';
import { UserLoyaltyPrizePointEntity } from '../../../../common/entity/user-loyalty-prize-point.entity';
import { ClientProxyService } from '../../../../common/client-proxy/client-proxy.service';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { BillingCommandEnum } from '../../../../common/enum/billing-command.enum';
import { LoyaltyStatusEnum } from '../../../../common/enum/loyalty.enum';

/**
 * todo: LoyaltyStatusEnum.Executive status should be moved to
 * todo: configurations in order to set any status as initial
 * */
@Injectable()
export class UserLoyaltyStatusService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly clientProxyService: ClientProxyService,
    private readonly prizeRepository: LoyaltyPrizeRepository,
    private readonly userStatusRepository: UserLoyaltyStatusRepository,
    private readonly userPrizePointsRepository: UserLoyaltyPrizePointRepository,
    private readonly userOrderRepository: UserLoyaltyOrderRepository,
    private readonly logger: Logger,
  ) {}

  async getStatus(userId: string): Promise<UserLoyaltyStatusEntity> {
    const inactiveDays = await this.clientProxyService.asyncSend<number>(
      MicroserviceEnum.BillingService,
      { cmd: BillingCommandEnum.GetInactiveDays },
      { userId },
    );

    const transaction = await this.sequelize.transaction();
    try {
      const userStatus = await this.userStatusRepository.findByUserId(
        userId,
        transaction,
      );
      if (!userStatus) {
        throw new LoyaltyException(
          'User status not found',
          ExceptionCodeEnum.UserLoyaltyStatusNotFound,
        );
      }

      if (
        inactiveDays > userStatus.loyalty.expiresAfterDays &&
        userStatus.status !== LoyaltyStatusEnum.Executive
      ) {
        await this.userStatusRepository.update(
          userId,
          { status: LoyaltyStatusEnum.Executive, points: 0 },
          transaction,
        );
        userStatus.status = LoyaltyStatusEnum.Executive;
        userStatus.points = 0;
      }

      await transaction.commit();

      return new UserLoyaltyStatusEntity(userStatus);
    } catch (e) {
      await transaction.rollback();
      if (e instanceof LoyaltyException) {
        throw e;
      }
      this.logger.error(e);

      throw new LoyaltyException(
        'User status not found',
        ExceptionCodeEnum.UserLoyaltyStatusNotFound,
      );
    }
  }

  async makePrizeOrder(
    userId: string,
    prizeId: number,
    country: string,
  ): Promise<UserLoyaltyOrderEntity> {
    const transaction = await this.sequelize.transaction();
    try {
      const prize = await this.getPrizeOrders(prizeId, country, transaction);
      const prizePoints = await this.getUserPrizePoints(
        userId,
        prize.points,
        transaction,
      );

      const [order] = await Promise.all([
        this.userOrderRepository.create(
          {
            userId,
            prizeId,
            status: OrderStatusEnum.Opened,
          },
          transaction,
        ),

        this.deductPrizePoints(prizePoints, prize.points, transaction),
      ]);

      await transaction.commit();
      return new UserLoyaltyOrderEntity(order);
    } catch (e) {
      await transaction.rollback();
      if (e instanceof LoyaltyException) {
        throw e;
      }
      this.logger.error(e);

      throw new LoyaltyException(
        'Prize order not created',
        ExceptionCodeEnum.LoyaltyPrizeOrderNotCreated,
      );
    }
  }

  private async getPrizeOrders(
    id: number,
    country: string,
    transaction: Transaction,
  ): Promise<LoyaltyPrizeEntity> {
    const prize = await this.prizeRepository.findById(id, transaction);
    if (!prize || !prize.enabled) {
      throw new LoyaltyException(
        'Prize not found',
        ExceptionCodeEnum.LoyaltyPrizeNotFound,
      );
    }
    if (prize.country !== country) {
      throw new LoyaltyException(
        'Prize not available in your country',
        ExceptionCodeEnum.LoyaltyPrizeCountryNotAvailable,
      );
    }

    return new LoyaltyPrizeEntity(prize);
  }

  private async getUserPrizePoints(
    userId: string,
    points: number,
    transaction: Transaction,
  ): Promise<UserLoyaltyPrizePointEntity[]> {
    const rows = await this.userPrizePointsRepository.getByUserId(
      userId,
      transaction,
    );
    if (rows?.length === 0) {
      throw new LoyaltyException(
        'Not enough points',
        ExceptionCodeEnum.LoyaltyNotEnoughPrizePoints,
      );
    }

    const entities: UserLoyaltyPrizePointEntity[] = [];
    let prizePoints = 0;
    for (const record of rows) {
      prizePoints += record.points;
      entities.push(new UserLoyaltyPrizePointEntity(record));
    }
    if (prizePoints < points) {
      throw new LoyaltyException(
        'Not enough points',
        ExceptionCodeEnum.LoyaltyNotEnoughPrizePoints,
      );
    }

    return entities;
  }

  private async deductPrizePoints(
    prizePoints: UserLoyaltyPrizePointEntity[],
    points: number,
    transaction: Transaction,
  ) {
    let leftPoints = points;
    const deleted = [];
    for (const record of prizePoints) {
      if (leftPoints >= record.points) {
        leftPoints -= record.points;
        deleted.push(record.id);
      } else {
        const [rows] = await this.userPrizePointsRepository.updateById(
          record.id,
          { points: record.points - leftPoints },
          transaction,
        );
        if (rows === 0) {
          throw new LoyaltyException(
            'Prize points not updated',
            ExceptionCodeEnum.LoyaltyPrizePointsNotDeducted,
          );
        }
        break;
      }
    }
    if (deleted.length > 0) {
      const cnt = await this.userPrizePointsRepository.removeByIds(
        deleted,
        transaction,
      );
      if (cnt !== deleted.length) {
        throw new LoyaltyException(
          'Prize points not removed',
          ExceptionCodeEnum.LoyaltyPrizePointsNotDeducted,
        );
      }
    }
  }
}
