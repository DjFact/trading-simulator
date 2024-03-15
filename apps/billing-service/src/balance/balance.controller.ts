/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BillingCommandEnum } from '../../../../common/enum/billing-command.enum';
import { BalanceService } from './balance.service';
import { UserDto } from '../../../../common/dto/user.dto';
import { TopUpDto } from '../../../../common/dto/top-up.dto';
import { AccountEntity } from '../../../../common/entity/balance.entity';

@Controller()
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @MessagePattern({ cmd: BillingCommandEnum.CreateAccount })
  createAccount(@Payload() user: UserDto): Promise<AccountEntity> {
    return this.balanceService.createAccount(user);
  }

  @MessagePattern({ cmd: BillingCommandEnum.GetBalance })
  getBalance(@Payload() user: UserDto): Promise<AccountEntity> {
    return this.balanceService.getBalance(user);
  }

  @MessagePattern({ cmd: BillingCommandEnum.TopUpDeposit })
  topUpDeposit(@Payload() topUp: TopUpDto & UserDto): Promise<AccountEntity> {
    return this.balanceService.topUpDeposit(topUp);
  }
}
