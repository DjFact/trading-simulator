/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 15.04.2021 16:54
 */

export enum MicroserviceEnum {
  AuthService = 'AUTH_SERVICE',
  LoyaltyService = 'LOYALTY_SERVICE',
  BillingService = 'BILLING_SERVICE',
  TradeService = 'TRADE_SERVICE',
  MailService = 'MAIL_SERVICE',

  MarketWorker = 'WORKER_MARKET',
  LimitWorker = 'WORKER_LIMIT',
  StopLossWorker = 'WORKER_STOP_LOSS',
}
