import { Body, Post, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { AccessTokenDto } from '../../../../../common/dto/access-token.dto';
import { TwoFactorConfirmDto } from '../../../../../common/dto/2fa-confirm.dto';
import { ApiOkResponseCustom } from '../../../../../common/swagger/response.schema';
import { AuthInfoDto } from '../../../../../common/dto/auth-info.dto';
import { TwoFactorRegistrationDto } from '../../../../../common/dto/2fa-registration.dto';

export abstract class TwoFactorAuthAbstractController {
  protected constructor(
    protected readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  @ApiOperation({ summary: 'Turn on two factor auth for new client' })
  @ApiOkResponseCustom(TwoFactorRegistrationDto, 200)
  @Put('2fa/register')
  twoFactorGenerate(@Body() { accessToken }: AccessTokenDto) {
    return this.twoFactorAuthService.twoFactorRegister(accessToken);
  }

  @ApiOperation({ summary: 'Verify two factor auth for new client' })
  @ApiOkResponseCustom(AuthInfoDto, 200)
  @Put('2fa/confirm')
  twoFactorConfirm(@Body() twoFactorDto: TwoFactorConfirmDto) {
    return this.twoFactorAuthService.twoFactorConfirm(twoFactorDto);
  }

  @ApiOperation({ summary: 'Verify two factor Sign' })
  @ApiOkResponseCustom(AuthInfoDto, 201)
  @Post('2fa/signIn')
  signInTwoFactor(@Body() twoFactorDto: TwoFactorConfirmDto) {
    return this.twoFactorAuthService.twoFactorSignIn(twoFactorDto);
  }
}
