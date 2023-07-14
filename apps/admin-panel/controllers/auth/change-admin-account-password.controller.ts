import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import ApiController from '@shared/infrastructure/controller/api-controller';
import { JwtUserGuard } from '@apps/shared/infrastructure/authentication/guards/jwt-user-guard';
import { User } from '@apps/shared/decorators/user-decorator';
import AuthenticatedUser from '@apps/shared/dto/authenticated-user';
import { inject } from '@shared/domain/decorators';
import CommandBus from '@shared/domain/bus/command/command-bus';
import QueryBus from '@shared/domain/bus/query/query-bus';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import AuthenticateAdminCommand from '@admin/auth/application/authenticate/authenticate-admin-command';
import AuthAdminInfrastructureCommandRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/auth-admin-infrastructure-command-repository';
import AdminAuthUser from '@admin/auth/domain/models/admin-auth-user';

class AdminAccountChangePasswordDto {
  @ApiProperty()
  password: string;

  @ApiProperty()
  oldPassword: string;
}

@ApiBearerAuth()
@UseGuards(JwtUserGuard)
@ApiTags('Admin')
@Controller({
  path: 'admin/change-password',
})
export class ChangeAdminAccountPasswordController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('AuthAdminCommandRepository')
    private repo: AuthAdminInfrastructureCommandRepository,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Post('/')
  @ApiResponse({
    status: 200,
    description: 'Admin change password',
  })
  @ApiOperation({
    summary: 'Cambiar clave',
  })
  async execute(
    @User() user: AuthenticatedUser,
    @Body() data: AdminAccountChangePasswordDto,
  ) {
    try {
      const token = await this.dispatch(
        new AuthenticateAdminCommand(user.email, data.oldPassword),
      );

      const hashedPassword = await this.passwordHasher.hashPassword(
        data.password,
      );
      const account = await this.repo.findUserById(user.id);

      if (!account) {
        throw new Error('invalid_credentials');
      }

      await this.repo.changePassword(
        AdminAuthUser.fromPrimitives({
          ...account.toPrimitives(),
          password: hashedPassword,
          plainPassword: data.password,
        }),
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
