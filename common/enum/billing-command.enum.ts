/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { generateCommandName } from '../transport.helper';

export class BillingCommandEnum {
  static HealthCheck = generateCommandName('billingHealthCheck');

  static CreateAccount = generateCommandName('createAccount');
  static GetBalance = generateCommandName('getBalance');
  static TopUpDeposit = generateCommandName('topUpDeposit');
  static GetOrders = generateCommandName('getOrders');
  static CreateOrder = generateCommandName('createOrder');
  static CancelOrder = generateCommandName('cancelOrder');
}
