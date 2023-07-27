import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import ApiController from '@shared/infrastructure/controller/api-controller';
import RequestResetVendorPasswordCommand from '../../../../../src/main/vendor/auth/application/request-vendor-customer-password/request-reset-vendor-password-command';
import VerifyResetVendorPasswordTokenQuery from '../../../../../src/main/vendor/auth/application/verify-reset-vendor-password-token/verify-reset-vendor-password-token-query';
import ResetVendorPasswordCommand from '../../../../../src/main/vendor/auth/application/reset-vendor-password/reset-vendor-password-command';

class VendorVerifyResetPasswordCodeDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  code: string;
}

class VendorRequestChangePasswordDto {
  @ApiProperty()
  email: string;
}

class VendorChangePasswordDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  password: string;
}

@ApiTags('Vendor')
@Controller({
  path: 'vendor/auth',
})
export class VendorAuthOptionsController extends ApiController {
  @Post('/request-change-password')
  @ApiResponse({
    status: 200,
    description: 'change password',
  })
  @ApiOperation({
    summary: 'Solicitar cambiar clave',
  })
  async request(@Body() data: VendorRequestChangePasswordDto) {
    try {
      await this.dispatch(new RequestResetVendorPasswordCommand(data.email));
      return {
        ok: true,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/verify-reset-password-code')
  @ApiResponse({
    status: 200,
    description: 'verify change password code',
  })
  @ApiOperation({
    summary: 'Verificar codigo de cambio clave',
  })
  async execute(@Body() data: VendorVerifyResetPasswordCodeDto) {
    try {
      return {
        valid: (
          await this.ask(
            new VerifyResetVendorPasswordTokenQuery(data.email, data.code),
          )
        ).result,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/change-password')
  @ApiResponse({
    status: 200,
    description: 'Change password',
  })
  @ApiOperation({
    summary: 'Cambiar clave',
  })
  async change(@Body() data: VendorChangePasswordDto) {
    try {
      await this.dispatch(
        new ResetVendorPasswordCommand(data.email, data.code, data.password),
      );
      return {
        ok: true,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
