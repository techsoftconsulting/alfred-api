import AdminAuthUser from '@admin/auth/domain/models/admin-auth-user';
import AuthAdminInfrastructureCommandRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/auth-admin-infrastructure-command-repository';
import { User } from '@apps/shared/decorators/user-decorator';
import AuthenticatedUser from '@apps/shared/dto/authenticated-user';
import { JwtUserGuard } from '@apps/shared/infrastructure/authentication/guards/jwt-user-guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import CommandBus from '@shared/domain/bus/command/command-bus';
import QueryBus from '@shared/domain/bus/query/query-bus';
import Criteria from '@shared/domain/criteria/criteria';
import Filters from '@shared/domain/criteria/filters';
import Order from '@shared/domain/criteria/order';
import { inject } from '@shared/domain/decorators';
import Id from '@shared/domain/id/id';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import Collection from '@shared/domain/value-object/collection';
import ApiController from '@shared/infrastructure/controller/api-controller';
import AdminRoleCommandInfrastructureRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/admin-role-infrastructure-command-repository';
import ListDto from '@apps/shared/dto/list-dto';
import EmailSender from '@shared/domain/email/email-sender';
import EmailContentParser from '@shared/domain/email/email-content-parser';
import { sendAdminWelcomeEmail } from '@apps/alfred/utils/emailUtils';

class AdminDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  credentials?: any;
}

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtUserGuard)
@Controller({
  path: 'admin/accounts',
})
export class AdminAccountsController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('AuthAdminCommandRepository')
    private repo: AuthAdminInfrastructureCommandRepository,
    @inject('AdminRoleCommandRepository')
    private roleFinder: AdminRoleCommandInfrastructureRepository,
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
              ...where,
              /* {
                                                                                                                                                                                                                                                                                                                                                                     field: 'id',
                                                                                                                                                                                                                                                                                                                                                                     operator: '!=',
                                                                                                                                                                                                                                                                                                                                                                     value: user.id,
                                                                                                                                                                                                                                                                                                                                                                   },*/
            ]),
          })
        : undefined;

      return await this.repo.getAll(criteria);
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

  @Get('/count')
  @ApiResponse({
    status: 200,
    description: 'Get count',
  })
  @ApiOperation({
    summary: 'Total',
  })
  async getTotal(
    @User() user: AuthenticatedUser,
    @Query() data: any,
  ): Promise<any> {
    try {
      return {
        count: await this.repo.count(
          new Criteria({
            order: undefined,
            filters: Filters.fromArray([
              {
                field: 'id',
                operator: '!=',
                value: user.id,
              },
            ]),
          }),
        ),
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
      return await this.repo.get(id);
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
    description: 'Create',
  })
  @ApiOperation({
    summary: 'Create',
  })
  async create(@Body() data: AdminDto): Promise<any> {
    try {
      const id = new Id();

      const newEntity = { ...data, id: id };

      const hashedPassword = await this.passwordHasher.hashPassword(
        newEntity.credentials.password,
      );
      const role = await this.roleFinder.get(newEntity.roleId);

      if (!role) throw new Error('admin_role_doesnt_exists');

      await this.repo.register(
        AdminAuthUser.create({
          ...newEntity,
          role: {
            id: role.id,
            name: role.name,
            permission: role.permissions,
            status: role.status,
          },
          credentials: {
            password: hashedPassword,
            email: newEntity.email,
          },
        }),
      );

      try {
        await sendAdminWelcomeEmail(
          {
            user: { ...data, password: (data as any).credentials.password },
          },
          this.mailer,
          this.emailContentParser,
        );
      } catch (e) {
        console.log(e);
      }

      return { ...newEntity, id: id.value };
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

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Update',
  })
  @ApiOperation({
    summary: 'Update',
  })
  async edit(@Param('id') id: string, @Body() data: AdminDto): Promise<any> {
    try {
      const admin = await this.repo.get(id);

      if (!admin) return;

      const role = await this.roleFinder.get(admin.roleId);

      if (!role) throw new Error('admin_role_doesnt_exists');

      const hashedPassword = (data as any).credentials
        ? await this.passwordHasher.hashPassword(
            (data as any).credentials.password,
          )
        : undefined;

      await this.repo.updateUser(
        AdminAuthUser.fromPrimitives({
          id: admin.id,
          role: {
            id: role.id,
            name: role.name,
            permission: role.permissions,
            status: role.status,
          },
          password: hashedPassword ?? admin.password,
          ...data,
        }),
      );

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
