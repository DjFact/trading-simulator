/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 13/03/2024 19:00
 */
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
