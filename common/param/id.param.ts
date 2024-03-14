/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdParam {
  /**
   * Id
   * @example f7b3b3e0-3e3e-4e3e-8e3e-3e3e3e3e3e3e
   */
  @IsUUID()
  @IsNotEmpty()
  readonly id: string;
}
