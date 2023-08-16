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
import CustomerAccountsRepository from '../../../../../src/main/customer/auth/domain/repositories/customer-accounts-repository';
import Id from '@shared/domain/id/id';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import AuthenticateCustomerAccountCommand from '../../../../../src/main/customer/auth/application/authenticate/authenticate-customer-account-command';

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

class CustomerDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

@ApiTags('Customer')
@Controller({
  path: 'customer',
})
export class CustomerRegisterController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
    @inject('CustomerAccountsRepository')
    private userRepo: CustomerAccountsRepository,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Post('/register')
  @ApiResponse({
    status: 200,
    schema: CustomerProfileObject,
  })
  @ApiOperation({
    summary: 'Registro como cliente',
  })
  async execute(@Body() data: CustomerDto): Promise<any> {
    try {
      const id = new Id().value;
      const hashedPassword = data.password
        ? await this.passwordHasher.hashPassword(data.password)
        : undefined;

      const exists = await this.userRepo.findByEmail(data.email);

      if (exists) {
        throw new Error('USER_ALREADY_EXISTS');
      }

      await this.userRepo.saveAccount({
        ...data,
        id: id,
        password: hashedPassword,
        status: 'ACTIVE',
      });
      const account = await this.userRepo.find(id);
      const token = await this.dispatch(
        new AuthenticateCustomerAccountCommand(data.email, data.password),
      );
      return {
        account,
        token: token,
      };
    } catch (error) {
      console.log(error.message);
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
