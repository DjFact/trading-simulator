import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GatewayAuthService } from './gateway-auth.service';
import { ResponseInterceptor } from '../../../../common/interfceptor/response.interceptor';
import { ResponseErrorEntity } from '../../../../common/entity/response-error.entity';
import { ApiOkResponseCustom } from '../../../../common/swagger/response.schema';
import { RecaptchaGuard } from '../../../../common/recaptcha/recaptcha-guard';
import { SignUpDto } from '../../../../common/dto/signup.dto';
import { SignInDto } from '../../../../common/dto/signin.dto';
import { AccessTokenDto } from '../../../../common/dto/access-token.dto';
import { RefreshTokenDto } from '../../../../common/dto/refresh-token.dto';
import { TwoFactorAuthAbstractController } from './2fa-auth/two-factor-auth.abstract.controller';
import { TwoFactorAuthService } from './2fa-auth/two-factor-auth.service';
import { Observable, switchMap } from 'rxjs';
import { getGeoByRequest } from '../../../../common/request.utils';
import { AuthInfoDto } from '../../../../common/dto/auth-info.dto';
import { UserEntity } from '../../../../common/entity/user.entity';

@ApiTags('Authentication Gateway Service')
@ApiInternalServerErrorResponse({ type: ResponseErrorEntity, status: 500 })
@UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
@Controller('api/auth')
export class GatewayAuthController extends TwoFactorAuthAbstractController {
  constructor(
    private authService: GatewayAuthService,
    protected readonly twoFactorAuthService: TwoFactorAuthService,
  ) {
    super(twoFactorAuthService);
  }

  @ApiOperation({ summary: 'Registration of new client' })
  @ApiOkResponseCustom(AuthInfoDto, 201)
  @UseGuards(RecaptchaGuard)
  @Post('signUp')
  signUp(@Req() req: Request, @Body() signUpDto: SignUpDto) {
    const geoIpInfo = getGeoByRequest(req);
    return this.authService.signUp(signUpDto, geoIpInfo?.country);
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiOkResponseCustom(AuthInfoDto, 201)
  @UseGuards(RecaptchaGuard)
  @Post('signIn')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: 'Auto Sign In' })
  @ApiOkResponseCustom(AuthInfoDto, 201)
  @Post('access')
  accessToken(@Body() accessDto: AccessTokenDto) {
    return this.authService.accessToken(accessDto);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponseCustom(AuthInfoDto, 201)
  @Post('refreshAccessToken')
  refreshAccessToken(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshDto);
  }

  @ApiOperation({ summary: 'Turn off two factor auth for the client' })
  @ApiOkResponseCustom(UserEntity, 200)
  @Put('2fa/disable')
  twoFactorDisable(@Body() access: AccessTokenDto): Observable<UserEntity> {
    return this.authService
      .accessToken(access)
      .pipe(
        switchMap(() =>
          this.twoFactorAuthService.twoFactorDisable(access.accessToken),
        ),
      );
  }
}
