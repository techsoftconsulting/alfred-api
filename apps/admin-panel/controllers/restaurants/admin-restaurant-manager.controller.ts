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
import AdminRestaurantManagerInfrastructureCommandRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/restaurants/admin-restaurant-manager-infrastructure-command-repository';
import { User } from '@apps/shared/decorators/user-decorator';
import AuthenticatedUser from '@apps/shared/dto/authenticated-user';
import Criteria from '@shared/domain/criteria/criteria';
import Collection from '@shared/domain/value-object/collection';
import Order from '@shared/domain/criteria/order';
import Filters from '@shared/domain/criteria/filters';
import PasswordHasher from '@shared/domain/utils/password-hasher';
import ListDto from '@apps/shared/dto/list-dto';
import EmailSender from '@shared/domain/email/email-sender';
import EmailContentParser from '@shared/domain/email/email-content-parser';
import AdminRestaurantInfrastructureCommandRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/restaurants/admin-restaurant-infrastructure-command-repository';
import EmailMessage from '@shared/domain/email/email-message';

class AdminRestaurantManagerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  restaurantId: string;

  @ApiProperty()
  roles: string[];

  @ApiProperty()
  status: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  password: string;
}

@ApiTags('Admin')
/*@ApiBearerAuth()
@UseGuards(JwtUserGuard)*/
@Controller({
  path: 'admin/restaurant-manager',
})
export class AdminRestaurantManagerController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('AdminRestaurantManagerRepository')
    private repo: AdminRestaurantManagerInfrastructureCommandRepository,
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
            filters: Filters.fromArray(where),
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
    description: 'Get by email',
  })
  @ApiOperation({
    summary: 'Get by email',
  })
  async findByEmail(@Param('email') email: string): Promise<any> {
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
  async save(@Body() data: AdminRestaurantManagerDto): Promise<any> {
    try {
      const exists = await this.repo.find(data.id);
      const hashedPassword = (data as any).credentials
        ? await this.passwordHasher.hashPassword(
            (data as any).credentials.password,
          )
        : undefined;

      const managerData: any = data;
      if (!managerData.restaurantId) return;

      const criteria = new Criteria({
        order: new Collection([]),
        filters: Filters.fromArray([
          /* {
                                                                                                                                                                                             field: 'status',
                                                                                                                                                                                             operator: '==',
                                                                                                                                                                                             value: 'ACTIVE',
                                                                                                                                                                                           },*/
          {
            field: 'roles',
            operator: 'array-contains',
            value: 'USER',
          },
          {
            field: 'restaurantId',
            operator: '==',
            value: managerData.restaurantId,
          },
          {
            field: 'principal',
            operator: '==',
            value: true,
          },
        ]),
      });

      const principalsUsers = await this.repo.findAll(criteria);

      const isPrincipal = !!principalsUsers.find((u) => u.id == managerData.id)
        ? true
        : principalsUsers.length == 0;

      await this.repo.save({
        ...data,
        ...(hashedPassword ? { password: hashedPassword } : {}),
        principal: isPrincipal,
      });

      if (!exists && (data as any).credentials) {
        try {
          await this.sendWelcomeEmail(
            { ...data, password: (data as any).credentials.password },
            data.restaurantId,
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

  private async sendWelcomeEmail(user, storeId) {
    const store = await this.storeRepo.find(storeId);

    if (!store) return;

    const link =
      store.type === 'RESTAURANT'
        ? `${process.env.RESTAURANT_PANEL_URL}/login?id=${store.slug}`
        : `${process.env.VENDOR_PANEL_URL}/login?id=${store.slug}`;

    await this.mailer.send(
      new EmailMessage({
        to: {
          email: user.email,
          name: user.firstName,
        },
        subject: 'Alfred - Bienvenido',
        content: await this.emailContentParser.parseFromFile(
          'general/store-welcome-email.ejs',
          {
            content: `<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">

        <tr>
            <td bgcolor="#ffffff" style="padding: 40px 30px;">
                <h1 style="color: #333333;">Confirmación de Registro</h1>
                <p style="color: #333333;">¡Hola ${user.firstName}!</p>
                <p style="color: #333333;">Para ingresar al panel:  <a href="${link}" >Haz click aquí</a></p>
                <p style="color: #333333;">Email: ${user.email}, password: ${user.password}</p>
                <p style="color: #333333;">Podrás cambiar tu clave al iniciar sesión</p>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f0f0f0" style="padding: 30px; text-align: center;">
                <p style="color: #666666; font-size: 12px;">Este correo electrónico es solo para fines de confirmación. Si tienes alguna pregunta o inquietud, por favor contáctanos.</p>
                <p style="color: #666666; font-size: 12px;">&copy; 2023 Alfred. Todos los derechos reservados.</p>
            </td>
        </tr>
    </table>`,
          },
        ),
      }),
    );
  }
}
