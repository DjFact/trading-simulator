/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 * Date: 22/09/2023 22:53
 */
import { RecaptchaProjectEnum } from './recaptcha-project.enum';

export interface IRecaptchaProjectConfig {
  secret: string;
  score: number;
}

export interface IRecaptchaConfig {
  url: string;
  projects: Record<RecaptchaProjectEnum, IRecaptchaProjectConfig>;
}
