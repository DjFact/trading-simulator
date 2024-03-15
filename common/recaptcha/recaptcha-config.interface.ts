/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
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
