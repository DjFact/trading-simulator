/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */

class PathDto {
  readonly invite: string;
  readonly login: string;
  readonly resetPassword: string;
  readonly client?: string;
  readonly invoice?: string;
}

export class ConfigPathDto {
  readonly url: string;
  readonly path: PathDto;
}
