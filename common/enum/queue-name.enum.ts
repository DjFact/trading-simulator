import { generateQueueName } from '../generate-queue-name';

export class QueueNameEnum {
  static MailSender = generateQueueName('{mailSender}');
}
