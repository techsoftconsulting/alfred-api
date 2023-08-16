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
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import { User } from '@apps/shared/decorators/user-decorator';
import AuthenticatedUser from '@apps/shared/dto/authenticated-user';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import RestaurantAccountsRepository from '@restaurants/auth/domain/repositories/restaurant-accounts-repository';

class UpdateHostProfileDto {
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

@ApiTags('Host')
@ApiBearerAuth()
@UseGuards(JwtUserGuard)
@Controller({
  path: 'host/profile',
})
export class RestaurantHostProfileController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
    @inject('RestaurantAccountsRepository')
    private userFinder: RestaurantAccountsRepository,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Get()
  @ApiResponse({
    status: 200,
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
  })
  @ApiOperation({
    summary: 'Actualizar perfil',
  })
  async update(
    @User() user: AuthenticatedUser,
    @Body() data: UpdateHostProfileDto,
  ): Promise<any> {
    try {
      const hashedPassword = data.password
        ? await this.passwordHasher.hashPassword(data.password)
        : undefined;

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
