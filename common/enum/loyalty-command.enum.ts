/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { generateCommandName } from '../transport.helper';

export class LoyaltyCommandEnum {
  static HealthCheck = generateCommandName('loyaltyHealthCheck');

  static GetAllStatuses = generateCommandName('getAllStatuses');
  static CreateStatus = generateCommandName('createStatus');
  static UpdateStatus = generateCommandName('updateStatus');
  static DeleteStatus = generateCommandName('deleteStatus');

  static GetAllPrizes = generateCommandName('getAllPrizes');
  static CreatePrize = generateCommandName('createPrize');
  static UpdatePrize = generateCommandName('updatePrize');
  static DeletePrize = generateCommandName('deletePrize');

  static GetUserStatus = generateCommandName('getUserStatus');
  static MakePrizeOrder = generateCommandName('makePrizeOrder');

  static RecalculateUserStatus = generateCommandName('recalculateUserStatus');
}
