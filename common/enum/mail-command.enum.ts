/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { generateCommandName } from '../transport.helper';

export class MailCommandEnum {
  static HealthCheck = generateCommandName('mailHealthCheck');
  static CreateAccountEmail = generateCommandName('createAccountEmail');
  static OtpEmail = generateCommandName('otpEmail');
}
