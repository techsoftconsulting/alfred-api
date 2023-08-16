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
import VendorAccountsInfrastructureCommandRepository from '../../../../../src/main/vendor/auth/infrastructure/persistance/typeorm/repositories/vendor-accounts-infrastructure-command-repository';
import AuthenticateVendorAccountCommand from '../../../../../src/main/vendor/auth/application/authenticate/authenticate-vendor-account-command';

class VendorAccountChangePasswordDto {
  @ApiProperty()
  password: string;

  @ApiProperty()
  oldPassword: string;
}

@ApiBearerAuth()
@UseGuards(JwtUserGuard)
@ApiTags('Vendor')
@Controller({
  path: 'vendor/change-password',
})
export class ChangeVendorAccountPasswordController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('VendorAccountsRepository')
    private repo: VendorAccountsInfrastructureCommandRepository,
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
    description: 'Vendor change password',
  })
  @ApiOperation({
    summary: 'Cambiar clave',
  })
  async execute(
    @User() user: AuthenticatedUser,
    @Body() data: VendorAccountChangePasswordDto,
  ) {
    try {
      const token = await this.dispatch(
        new AuthenticateVendorAccountCommand(user.email, data.oldPassword),
      );

      const hashedPassword = await this.passwordHasher.hashPassword(
        data.password,
      );
      const account = await this.repo.find(user.id);

      if (!account) {
        throw new Error('invalid_credentials');
      }

      await this.repo.saveAccount({
        ...account,
        ...(hashedPassword
          ? { password: hashedPassword, customPasswordConfigured: true }
          : {}),
      });

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
