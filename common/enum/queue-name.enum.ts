import { generateQueueName } from '../generate-queue-name';

export class QueueNameEnum {
  static MailSender = generateQueueName('{mailSender}');

  static MarketOrders = generateQueueName('MarketOrders');
  static LimitOrders = generateQueueName('LimitOrders');
  static StopLossOrders = generateQueueName('StopLossOrders');
}
