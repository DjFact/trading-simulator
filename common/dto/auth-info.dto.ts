/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { UserEntity } from '../entity/user.entity';

export class AuthInfoDto {
  readonly user: UserEntity & { twoFactorCompleted?: boolean };

  /**
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZGE5YThmY2NjYjdkYWRhYjhjNmE1YiIsInJvbGVzIjpbImludml0ZSJdLCJuYW1lIjoiVmlrdG9yIFBsb3RuaWtvdiIsImlhdCI6MTYwODE2NTEyNCwiZXhwIjoxNjA4MTY2MDI0fQ.MYN0TrgTBpmHFLSj33jSF4wp3BAPmtVZb0aIP9Gb4Tk
   */
  readonly access_token: string;

  /**
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyOTgwMDU3OSwiZXhwIjoxNjMwNjY0NTc5fQ.0y5GqaBbdRmSjr8oAMn9DltVUIqekYLrHgJ7YVbI1yU
   */
  readonly refresh_token?: string;

  constructor(user: UserEntity, token: string, refresh?: string) {
    this.user = user;
    this.access_token = token;
    this.refresh_token = refresh;
  }
}
