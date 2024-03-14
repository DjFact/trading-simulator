/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 14/03/2024 18:56
 */
import { Injectable } from '@nestjs/common';
import { MarketStrategy } from './market.strategy';
import { LimitStrategy } from './limit.strategy';
import { StopLossStrategy } from './stop-loss.strategy';
import { OrderTypeEnum } from '../../../common/enum/order-type.enum';
import { BaseStrategy } from './base.strategy';
import { StrategyException } from '../../../common/exception/strategy.exception';
import { ExceptionCodeEnum } from '../../../common/enum/exception-code.enum';

@Injectable()
export class StrategyFactory {
  constructor(
    private readonly marketStrategy: MarketStrategy,
    private readonly limitStrategy: LimitStrategy,
    private readonly stopLossStrategy: StopLossStrategy,
  ) {}

  getStrategy(type: OrderTypeEnum): BaseStrategy {
    switch (type) {
      case OrderTypeEnum.Market:
        return this.marketStrategy;
      case OrderTypeEnum.Limit:
        return this.limitStrategy;
      case OrderTypeEnum.StopLoss:
        return this.stopLossStrategy;
      default:
        throw new StrategyException(
          'Strategy not found',
          ExceptionCodeEnum.StrategyNotFound,
        );
    }
  }
}
