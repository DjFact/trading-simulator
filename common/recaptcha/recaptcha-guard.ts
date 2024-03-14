import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import {
  IRecaptchaConfig,
  IRecaptchaProjectConfig,
} from './recaptcha-config.interface';
import { RecaptchaProjectEnum } from './recaptcha-project.enum';
import { IRecaptchaAction } from './recaptcha-action.interface';
import EnvironmentEnum from '../enum/environment.enum';

const RECAPTCHA_HEADER = 'x-recaptcha-token';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  private readonly projectActions: IRecaptchaAction[] = [
    {
      project: RecaptchaProjectEnum.Auth,
      actions: ['signUp', 'signIn', 'sendOtp'],
    },
  ];
  private readonly config: IRecaptchaConfig;

  constructor(
    readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {
    this.config = this.configService.get('recaptcha');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.config?.url || !this.config?.projects) {
      return this.notConfiguredRecaptcha();
    }

    const action = context.getHandler().name;
    const project = this.projectActions.find((p) => p.actions.includes(action));
    if (!project) {
      return this.notConfiguredRecaptcha();
    }

    const params: IRecaptchaProjectConfig =
      this.config.projects[project.project];
    if (!params) {
      return this.notConfiguredRecaptcha();
    }

    const request = context.switchToHttp().getRequest();
    const recaptchaToken = request.get(RECAPTCHA_HEADER);
    if (!recaptchaToken) {
      throw new ForbiddenException(`Captcha header doesn't exist`);
    }

    const searchParams = new URLSearchParams({
      secret: params.secret,
      response: recaptchaToken,
    });

    const data = await lastValueFrom(
      this.httpService.post(`${this.config.url}?${searchParams}`).pipe(
        map((response) => response.data),
        catchError((error) => {
          this.logger.error(error);
          throw new BadRequestException(error);
        }),
      ),
    );

    this.logger.log(`[${action}]: Captcha result ${JSON.stringify(data)}`);
    if (data.success && data.score >= params.score && data.action === action) {
      return true;
    }

    throw new ForbiddenException(
      `Captcha is not valid: ${data['error-codes']}`,
    );
  }

  private notConfiguredRecaptcha(): boolean {
    if (process.env.NODE_ENV === EnvironmentEnum.Production) {
      this.logger.error('Recaptcha is not configured');
      return false;
    }

    this.logger.warn('Recaptcha is not configured');
    return true;
  }
}
