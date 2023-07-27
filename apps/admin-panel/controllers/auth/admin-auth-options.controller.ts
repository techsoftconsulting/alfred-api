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
import RequestResetAdminPasswordCommand from '@admin/auth/application/request-reset-admin-password/request-reset-admin-password-command';
import ResetAdminPasswordCommand from '@admin/auth/application/reset-admin-password/reset-admin-password-command';
import VerifyResetAdminPasswordTokenQuery from '@admin/auth/application/verify-reset-admin-password-token/verify-reset-admin-password-token-query';
import { inject } from '@shared/domain/decorators';
import CommandBus from '@shared/domain/bus/command/command-bus';
import QueryBus from '@shared/domain/bus/query/query-bus';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import EmailSender from '@shared/domain/email/email-sender';
import EmailContentParser from '@shared/domain/email/email-content-parser';

class AdminVerifyResetPasswordCodeDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  code: string;
}

class AdminRequestChangePasswordDto {
  @ApiProperty()
  email: string;
}

class AdminChangePasswordDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  password: string;
}

@ApiTags('Admin')
@Controller({
  path: 'admin/forgot-password',
})
export class AdminAuthOptionsController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
    @inject('services.email')
    private mailer: EmailSender,
    @inject('email.content.parser')
    private emailContentParser: EmailContentParser,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Post('/request-change-password')
  @ApiResponse({
    status: 200,
    description: 'Admin change password',
  })
  @ApiOperation({
    summary: 'Solicitar cambiar clave',
  })
  async request(@Body() data: AdminRequestChangePasswordDto) {
    try {
      await this.dispatch(new RequestResetAdminPasswordCommand(data.email));
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
  async execute(@Body() data: AdminVerifyResetPasswordCodeDto) {
    try {
      return {
        valid: (
          await this.ask(
            new VerifyResetAdminPasswordTokenQuery(data.email, data.code),
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
  async change(@Body() data: AdminChangePasswordDto) {
    try {
      await this.dispatch(
        new ResetAdminPasswordCommand(data.email, data.code, data.password),
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
