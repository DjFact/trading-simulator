/**
 * Created by Viktor Plotnikov <viktorr.plotnikov@gmail.com>
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { OtpCachedInterface } from '../../../../common/interface/otp-cached.interface';
import { ClientProxyService } from '../../../../common/client-proxy/client-proxy.service';
import { OtpCheckResponseDto } from '../../../../common/dto/otp-check-response.dto';
import { OtpCheckDto } from '../../../../common/dto/otp-check.dto';
import { OtpDto } from '../../../../common/dto/otp.dto';
import { MicroserviceEnum } from '../../../../common/enum/microservice.enum';
import { MailCommandEnum } from '../../../../common/enum/mail-command.enum';
import { ExceptionCodeEnum } from '../../../../common/enum/exception-code.enum';
import { OtpException } from '../../../../common/exception/otp.exception';

const OTP_EMAIL_PREFIX = 'otp_email_';

@Injectable()
export class OtpService {
  static generateOtpCode(digits = 6): OtpCachedInterface {
    let code = '';
    for (let i = 0; i < digits; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    return { code, createdAt: Date.now() } as OtpCachedInterface;
  }

  private readonly ttl: number;

  constructor(
    protected readonly clientProxyService: ClientProxyService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly logger: Logger,
  ) {
    this.ttl = this.configService.get('cache.otpTtl');
  }

  async sendOtp({ email }: OtpDto): Promise<boolean> {
    const genCode = OtpService.generateOtpCode();
    if (!email) {
      this.logger.error('OTP Error. Email is empty', { email });
      return false;
    }

    await this.checkDuplicateCode(OTP_EMAIL_PREFIX, email, genCode);
    this.clientProxyService.emit(
      MicroserviceEnum.MailService,
      { cmd: MailCommandEnum.OtpEmail },
      { email, code: genCode.code },
    );

    return true;
  }

  async checkOtp(otpCheckDto: OtpCheckDto): Promise<OtpCheckResponseDto> {
    return this.checkCodeBySource(
      OTP_EMAIL_PREFIX,
      otpCheckDto.email,
      otpCheckDto.code,
    );
  }

  private async checkDuplicateCode(
    prefix: string,
    customKey: string,
    genCode: OtpCachedInterface,
  ): Promise<void> {
    const cachedCodeKey = prefix + customKey;
    let cachedCode: string | OtpCachedInterface =
      await this.cacheManager.get(cachedCodeKey);
    if (cachedCode) {
      cachedCode = <OtpCachedInterface>JSON.parse(cachedCode as string);
      if (Date.now() - cachedCode.createdAt <= 60000) {
        throw new OtpException(
          'One-time password has already send. Please wait 60 seconds',
          ExceptionCodeEnum.OneTimePasswordAlreadySent,
        );
      }
    }

    await this.cacheManager.set(
      cachedCodeKey,
      JSON.stringify(genCode),
      this.ttl,
    );
  }

  private async checkCodeBySource(
    prefix: string,
    customKey: string,
    code: string,
  ): Promise<OtpCheckResponseDto> {
    let cachedCode: string | OtpCachedInterface = await this.cacheManager.get(
      prefix + customKey,
    );
    if (!cachedCode) {
      return { status: false, error: 'One-time password was expired!' };
    }

    cachedCode = <OtpCachedInterface>JSON.parse(cachedCode as string);
    if (!cachedCode.code || cachedCode.code !== code) {
      return { status: false, error: 'One-time password is wrong!' };
    }

    return { status: true, error: null };
  }
}
