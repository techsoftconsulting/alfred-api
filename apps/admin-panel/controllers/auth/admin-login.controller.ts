import AuthenticateAdminCommand from '@admin/auth/application/authenticate/authenticate-admin-command';
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
import CommandBus from '@shared/domain/bus/command/command-bus';
import QueryBus from '@shared/domain/bus/query/query-bus';
import { inject } from '@shared/domain/decorators';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import ApiController from '@shared/infrastructure/controller/api-controller';

class AdminCredentialsDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

@ApiTags('Admin')
@Controller({
  path: 'admin',
})
export class AdminLoginController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Post('/login')
  @ApiResponse({
    status: 200,
    description: 'Admin regular authentication',
  })
  @ApiOperation({
    summary: 'Iniciar sesion como Admin',
  })
  async execute(
    @Body() credentials: AdminCredentialsDto,
  ): Promise<{ token: string }> {
    try {
      const token = await this.dispatch(
        new AuthenticateAdminCommand(credentials.email, credentials.password),
      );

      return {
        token: token,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
