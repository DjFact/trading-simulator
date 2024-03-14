/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { generateCommandName } from '../transport.helper';

export class AuthCommandEnum {
  static HealthCheck = generateCommandName('authHealthCheck');

  static SignUp = generateCommandName('signUp');
  static Authorization = generateCommandName('authorization');
  static RefreshToken = generateCommandName('refreshToken');
  static Authentication = generateCommandName('authentication');

  static TwoFactorAuthentication = generateCommandName(
    'twoFactorAuthentication',
  );
  static TwoFactorGenerate = generateCommandName('twoFactorGenerate');
  static TwoFactorConfirm = generateCommandName('twoFactorConfirm');
  static TwoFactorDisable = generateCommandName('twoFactorDisable');

  static SendOtp = generateCommandName('sendOtp');
  static CheckOtp = generateCommandName('checkOtp');

  static CreateUser = generateCommandName('createUser');
  static GetByLoginAndPassword = generateCommandName('getByLoginAndPassword');
  static GetAllUsers = generateCommandName('getAllUsers');
  static GetUser = generateCommandName('getUser');
  static UpdateUser = generateCommandName('updateUser');
}
