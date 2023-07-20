import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtUserGuard } from '@apps/shared/infrastructure/authentication/guards/jwt-user-guard';
import ApiController from '@shared/infrastructure/controller/api-controller';
import { inject } from '@shared/domain/decorators';
import CommandBus from '@shared/domain/bus/command/command-bus';
import QueryBus from '@shared/domain/bus/query/query-bus';
import CustomerAccountsRepository from '../../../../../src/main/customer/auth/domain/repositories/customer-accounts-repository';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import { User } from '@apps/shared/decorators/user-decorator';
import AuthenticatedUser from '@apps/shared/dto/authenticated-user';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import PasswordHasher from '@shared/domain/utils/password-hasher';

class UpdateCustomerProfileDto {
  @ApiProperty({
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    required: false,
  })
  email?: string;

  @ApiProperty({
    required: false,
  })
  password?: string;
}

const CustomerProfileObject: SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
  },
};

@ApiTags('Customer')
@ApiBearerAuth()
@UseGuards(JwtUserGuard)
@Controller({
  path: 'customer/profile',
})
export class CustomerProfileController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
    @inject('CustomerAccountsRepository')
    private userFinder: CustomerAccountsRepository,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Get()
  @ApiResponse({
    status: 200,
    schema: CustomerProfileObject,
  })
  @ApiOperation({
    summary: 'Recuperar perfil',
  })
  async get(@User() user: AuthenticatedUser): Promise<any> {
    try {
      return await this.userFinder.find(user.id);
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

  @Patch()
  @ApiResponse({
    status: 200,
    schema: CustomerProfileObject,
  })
  @ApiOperation({
    summary: 'Actualizar perfil',
  })
  async update(
    @User() user: AuthenticatedUser,
    @Body() data: UpdateCustomerProfileDto,
  ): Promise<any> {
    try {
      const hashedPassword = data.password
        ? await this.passwordHasher.hashPassword(data.password)
        : undefined;

      const exists = await this.userFinder.findByEmail(data.email);

      if (exists && exists.id !== user.id) {
        throw new Error('USER_ALREADY_EXISTS');
      }

      await this.userFinder.saveAccount({
        id: user.id,
        ...data,
        ...(hashedPassword ? { password: hashedPassword } : {}),
      });

      const entity = await this.userFinder.find(user.id);
      return entity;
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
