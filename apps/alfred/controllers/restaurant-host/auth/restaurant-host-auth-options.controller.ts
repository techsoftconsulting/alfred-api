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
import RequestResetRestaurantPasswordCommand from '@restaurants/auth/application/request-reset-restaurant-password/request-reset-restaurant-password-command';
import VerifyResetRestaurantPasswordTokenQuery from '@restaurants/auth/application/verify-reset-restaurant-password-token/verify-reset-restaurant-password-token-query';
import ResetRestaurantPasswordCommand from '@restaurants/auth/application/reset-restaurant-password/reset-restaurant-password-command';

class RestaurantHostVerifyResetPasswordCodeDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  code: string;
}

class RestaurantHostRequestChangePasswordDto {
  @ApiProperty()
  email: string;
}

class RestaurantHostChangePasswordDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  password: string;
}

@ApiTags('Host')
@Controller({
  path: 'host/forgot-password',
})
export class RestaurantAuthOptionsController extends ApiController {
  @Post('/request-change-password')
  @ApiResponse({
    status: 200,
    description: 'change password',
  })
  @ApiOperation({
    summary: 'Solicitar cambiar clave',
  })
  async request(@Body() data: RestaurantHostRequestChangePasswordDto) {
    try {
      await this.dispatch(
        new RequestResetRestaurantPasswordCommand(data.email),
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

  @Post('/verify-reset-password-code')
  @ApiResponse({
    status: 200,
    description: 'verify change password code',
  })
  @ApiOperation({
    summary: 'Verificar codigo de cambio clave',
  })
  async execute(@Body() data: RestaurantHostVerifyResetPasswordCodeDto) {
    try {
      return {
        valid: (
          await this.ask(
            new VerifyResetRestaurantPasswordTokenQuery(data.email, data.code),
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
  async change(@Body() data: RestaurantHostChangePasswordDto) {
    try {
      await this.dispatch(
        new ResetRestaurantPasswordCommand(
          data.email,
          data.code,
          data.password,
        ),
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
