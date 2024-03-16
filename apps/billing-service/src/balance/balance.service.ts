/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from '../../../../common/dto/user.dto';
import { TopUpDto } from '../../../../common/dto/top-up.dto';
import { AccountRepository } from '../repository/account.repository';
import { BillingException } from '../../../../common/exception/billing.exception';
import { ExceptionCodeEnum } from '../../../../common/enum/exception-code.enum';
import { AccountEntity } from '../../../../common/entity/balance.entity';
import { Sequelize } from 'sequelize-typescript';
import { MqService } from '../../../../common/mq/mq.service';
import { QueueNameEnum } from '../../../../common/enum/queue-name.enum';

@Injectable()
export class BalanceService {
  public constructor(
    private readonly sequelize: Sequelize,
    protected readonly mqService: MqService,
    private readonly accountRepository: AccountRepository,
    private readonly logger: Logger,
  ) {}

  async createAccount({ userId }: UserDto): Promise<AccountEntity> {
    try {
      const balance = await this.accountRepository.create(userId);

      return new AccountEntity(balance);
    } catch (e) {
      this.logger.error(e, { userId });
      throw new BillingException(
        'Account not created',
        ExceptionCodeEnum.AccountCreationError,
      );
    }
  }

  async getBalance({ userId }: UserDto): Promise<AccountEntity> {
    const balance = await this.accountRepository.findByUserId(userId);
    if (!balance) {
      throw new BillingException(
        'Balance not found',
        ExceptionCodeEnum.BalanceNotFound,
      );
    }

    return new AccountEntity(balance);
  }

  async topUpDeposit({
    userId,
    amount,
  }: TopUpDto & UserDto): Promise<AccountEntity> {
    const balance = await this.sequelize.transaction(async (transaction) => {
      const [rows] = await this.accountRepository.increment(
        userId,
        amount,
        null,
        transaction,
      );
      if (!rows?.length) {
        throw new BillingException(
          'Balance not updated',
          ExceptionCodeEnum.BalanceNotUpdated,
        );
      }

      const balance = await this.accountRepository.findByUserId(
        userId,
        transaction,
      );
      if (!balance) {
        throw new BillingException(
          'Balance not found',
          ExceptionCodeEnum.BalanceNotFound,
        );
      }

      return new AccountEntity(balance);
    });

    await this.mqService.sendToQueue(QueueNameEnum.RecalculateLoyalty, {
      userId: balance.userId,
    });

    return balance;
  }
}
