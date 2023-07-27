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
import RequestResetCustomerPasswordCommand from '../../../../../src/main/customer/auth/application/request-reset-customer-password/request-reset-customer-password-command';
import VerifyResetCustomerPasswordTokenQuery from '../../../../../src/main/customer/auth/application/verify-reset-customer-password-token/verify-reset-customer-password-token-query';
import ResetCustomerPasswordCommand from '../../../../../src/main/customer/auth/application/reset-customer-password/reset-customer-password-command';

class CustomerHostVerifyResetPasswordCodeDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  code: string;
}

class CustomerHostRequestChangePasswordDto {
  @ApiProperty()
  email: string;
}

class CustomerHostChangePasswordDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  password: string;
}

@ApiTags('Customer')
@Controller({
  path: 'customer/forgot-password',
})
export class CustomerAuthOptionsController extends ApiController {
  @Post('/request-change-password')
  @ApiResponse({
    status: 200,
    description: 'change password',
  })
  @ApiOperation({
    summary: 'Solicitar cambiar clave',
  })
  async request(@Body() data: CustomerHostRequestChangePasswordDto) {
    try {
      await this.dispatch(new RequestResetCustomerPasswordCommand(data.email));
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
  async execute(@Body() data: CustomerHostVerifyResetPasswordCodeDto) {
    try {
      return {
        valid: (
          await this.ask(
            new VerifyResetCustomerPasswordTokenQuery(data.email, data.code),
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
  async change(@Body() data: CustomerHostChangePasswordDto) {
    try {
      await this.dispatch(
        new ResetCustomerPasswordCommand(data.email, data.code, data.password),
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
