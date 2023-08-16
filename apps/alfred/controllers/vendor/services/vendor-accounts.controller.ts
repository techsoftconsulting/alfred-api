import { JwtUserGuard } from '@apps/shared/infrastructure/authentication/guards/jwt-user-guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import CommandBus from '@shared/domain/bus/command/command-bus';
import QueryBus from '@shared/domain/bus/query/query-bus';
import { inject } from '@shared/domain/decorators';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import ApiController from '@shared/infrastructure/controller/api-controller';
import { User } from '@apps/shared/decorators/user-decorator';
import AuthenticatedUser from '@apps/shared/dto/authenticated-user';
import Criteria from '@shared/domain/criteria/criteria';
import Collection from '@shared/domain/value-object/collection';
import Order from '@shared/domain/criteria/order';
import Filters from '@shared/domain/criteria/filters';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import VendorAccountsInfrastructureCommandRepository from '../../../../../src/main/vendor/auth/infrastructure/persistance/typeorm/repositories/vendor-accounts-infrastructure-command-repository';
import ListDto from '@apps/shared/dto/list-dto';
import EmailSender from '@shared/domain/email/email-sender';
import EmailContentParser from '@shared/domain/email/email-content-parser';
import AdminRestaurantInfrastructureCommandRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/restaurants/admin-restaurant-infrastructure-command-repository';
import { sendStoreWelcomeEmail } from '@apps/alfred/utils/emailUtils';

class VendorAccountDto {}

@ApiTags('Vendor')
@ApiBearerAuth()
@UseGuards(JwtUserGuard)
@Controller({
  path: 'vendor/accounts',
})
export class VendorAccountsController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('VendorAccountsRepository')
    private repo: VendorAccountsInfrastructureCommandRepository,
    @inject('AdminRestaurantRepository')
    private storeRepo: AdminRestaurantInfrastructureCommandRepository,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
    @inject('utils.passwordHasher')
    private passwordHasher: PasswordHasher,
    @inject('services.email')
    private mailer: EmailSender,
    @inject('email.content.parser')
    private emailContentParser: EmailContentParser,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List',
  })
  @ApiOperation({
    summary: 'List',
  })
  async list(
    @User() user: AuthenticatedUser,
    @Query() params: ListDto,
  ): Promise<any> {
    try {
      const order = params['filter[order]']
        ? JSON.parse(params['filter[order]'])
        : undefined;
      const limit = params['filter[limit]'];
      const skip = params['filter[skip]'];
      const where = JSON.parse(params['filter[where]'] ?? '[]');

      const criteria = params
        ? new Criteria({
            order: new Collection(
              order ? [Order.fromValues(order.orderBy, order.orderType)] : [],
            ),
            limit: limit ? parseInt(limit) : undefined,
            offset: skip ? parseInt(skip) : undefined,
            filters: Filters.fromArray([
              ...(where ?? []),
              ...[
                {
                  operator: '==',
                  field: 'vendorId',
                  value: user.metadata.vendorId,
                },
              ],
            ]),
          })
        : undefined;

      return await this.repo.findAll(criteria);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
  })
  async get(@Param('id') id: string): Promise<any> {
    try {
      return await this.repo.find(id);
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

  @Get('/email/:email')
  @ApiResponse({
    status: 200,
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
  })
  async getBySlug(@Param('email') email: string): Promise<any> {
    try {
      return await this.repo.findByEmail(email);
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

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Save',
  })
  @ApiOperation({
    summary: 'Save',
  })
  async save(@Body() data: VendorAccountDto): Promise<any> {
    try {
      const hashedPassword = (data as any).credentials
        ? await this.passwordHasher.hashPassword(
            (data as any).credentials.password,
          )
        : undefined;

      const exists = await this.repo.findByEmail((data as any).email);

      if (exists && exists.id !== (data as any).id) {
        throw new Error('USER_ALREADY_EXISTS');
      }

      await this.repo.saveAccount({
        ...data,
        ...(hashedPassword ? { password: hashedPassword } : {}),
      });

      if (!exists && (data as any).credentials) {
        try {
          await sendStoreWelcomeEmail(
            {
              user: { ...data, password: (data as any).credentials.password },
              storeId: (data as any).restaurantId,
            },
            this.storeRepo,
            this.mailer,
            this.emailContentParser,
          );
        } catch (e) {
          console.log(e);
        }
      }

      return { ok: true };
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

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'delete',
  })
  @ApiOperation({
    summary: 'delete',
  })
  async delete(@Param('id') id: string): Promise<any> {
    try {
      await this.repo.delete(id);
      return { ok: true };
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
