import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
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
import RestaurantReservationInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-reservation-infrastructure-command-repository';
import { User } from '@apps/shared/decorators/user-decorator';
import AuthenticatedUser from '@apps/shared/dto/authenticated-user';
import Criteria from '@shared/domain/criteria/criteria';
import Collection from '@shared/domain/value-object/collection';
import Order from '@shared/domain/criteria/order';
import Filters from '@shared/domain/criteria/filters';
import CustomerAccountsRepository from '../../../../../src/main/customer/auth/domain/repositories/customer-accounts-repository';
import RestaurantMallInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-mall-infrastructure-command-repository';
import RestaurantInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-infrastructure-command-repository';
import RestaurantAreaInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-area-infrastructure-command-repository';
import Id from '@shared/domain/id/id';
import SimpleCodeGenerator from '@shared/infrastructure/utils/simple-code-generator';
import { DateTimeUtils, ObjectUtils } from '@shared/domain/utils';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import EmailSender from '@shared/domain/email/email-sender';
import EmailContentParser from '@shared/domain/email/email-content-parser';
import EmailMessage from '@shared/domain/email/email-message';

const QRCode = require('qrcode');

class ReservationListDto {
  @ApiProperty({
    required: false,
    description: 'Ejemplo: {"orderBy": "datetime", "orderType": "ASC"}',
  })
  'order'?: string;

  @ApiProperty({
    required: false,
  })
  'limit'?: string;

  @ApiProperty({
    required: false,
  })
  'skip'?: string;

  @ApiProperty({
    required: false,
    description:
      'Ejemplo: [{"field":"cancelled","operator":"==","value":false}, {"field":"date","operator":">=","value":"2023-07-01"}, {"field":"date","operator":"<=","value":"2023-07-30"}]',
  })
  'where'?: string;
}

class ReservationCustomerDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({
    required: false,
  })
  allergies?: string;

  @ApiProperty({
    required: false,
  })
  phone?: string;
}

class CustomerReservationDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    required: false,
  })
  phone?: string;

  @ApiProperty()
  restaurantId: string;

  @ApiProperty()
  tableId: string;

  @ApiProperty({
    required: false,
  })
  allergies?: string;

  @ApiProperty({
    description: 'Formato 24 hrs. Ejemplo: 18:00',
  })
  hour: string;

  @ApiProperty({
    description: 'Formato YYYY-MM-DD. Ejemplo: 2023-10-17',
  })
  date: string;

  @ApiProperty()
  numberOfPeople: number;
}

const ReservationObject: SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    restaurantId: {
      type: 'string',
    },
    mallId: {
      type: 'string',
    },
    tableId: {
      type: 'string',
    },
    code: {
      type: 'string',
    },
    hour: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
    numberOfPeople: {
      type: 'number',
    },
    cancelled: {
      type: 'boolean',
    },
    checkedIn: {
      type: 'boolean',
    },
    checkedInAt: {
      type: 'string',
    },
    restaurant: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        logoUrl: {
          type: 'string',
        },
      },
    },
    mall: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
      },
    },
    table: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        areaId: {
          type: 'string',
        },
      },
    },
    client: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
    },
  },
};

@ApiTags('Customer')
@Controller({
  path: 'customer/reservation',
})
export class RestaurantReservationController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('RestaurantReservationRepository')
    private repo: RestaurantReservationInfrastructureCommandRepository,
    @inject('RestaurantMallRepository')
    private mallRepo: RestaurantMallInfrastructureCommandRepository,
    @inject('RestaurantRepository')
    private restaurantRepo: RestaurantInfrastructureCommandRepository,
    @inject('CustomerAccountsRepository')
    private userFinder: CustomerAccountsRepository,
    @inject('RestaurantAreaRepository')
    private areaRepo: RestaurantAreaInfrastructureCommandRepository,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
    @inject('simple.code.generator')
    private codeGenerator: SimpleCodeGenerator,
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
    summary: 'Lista de reservaciones',
  })
  async list(
    @User() user: AuthenticatedUser,
    @Query() params: ReservationListDto,
  ): Promise<any> {
    try {
      const order = params['order'] ? JSON.parse(params['order']) : undefined;
      const limit = params['limit'];
      const skip = params['skip'];
      const where = JSON.parse(params['where'] ?? '[]');

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
                  field: 'clientId',
                  operator: '==',
                  value: user.id,
                },
                {
                  field: 'status',
                  operator: '==',
                  value: 'ACTIVE',
                },
              ],
            ]),
          })
        : undefined;

      return await this.repo.findReservations(criteria);
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
    schema: ReservationObject,
  })
  @ApiOperation({
    summary: 'Detalle de reservacion',
  })
  async get(@Param('id') id: string): Promise<any> {
    try {
      return await this.repo.getReservation(id);
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
    schema: ReservationObject,
  })
  @ApiOperation({
    summary: 'Crear reservacion',
  })
  async create(@Body() data: CustomerReservationDto): Promise<any> {
    try {
      const { mall, table, restaurant } = await this.findReservationInfo(data);
      const id = new Id().value;

      await this.repo.createReservation({
        ...ObjectUtils.omit(data, ['phone', 'allergies']),
        id: id,
        code: this.codeGenerator.generate(),
        datetime: DateTimeUtils.toTimezone(
          DateTimeUtils.fromString(
            `${data.date} ${data.hour}`,
            'YYYY-MM-DD HH:mm',
          ),
          'UTC',
        ),
        table: {
          id: table.id,
          name: `Mesa ${table.number}`,
          areaId: table.areaId,
        },
        mall: {
          id: mall.id,
          name: mall.name,
        },
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          logoUrl: restaurant.logoUrl,
        },
        client: {
          /* id: data.id,*/
          firstName: data.firstName,
          lastName: data.lastName,
          allergies: data.allergies,
          phone: data.phone,
          email: data.email,
        },
        status: 'ACTIVE',
      });

      const entity = await this.repo.getReservation(id);

      await sendReservation(
        this.mailer,
        this.emailContentParser,
        { firstName: data.firstName, email: data.email },
        { id: id },
      );
      return entity;
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

  @Patch(':id')
  @ApiResponse({
    status: 200,
    schema: ReservationObject,
  })
  @ApiOperation({
    summary: 'Actualizar reservacion',
  })
  async update(
    @Body() data: CustomerReservationDto,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      const { mall, table, restaurant } = await this.findReservationInfo(data);
      await this.repo.updateReservation({
        id,
        ...ObjectUtils.omit(data, ['phone', 'allergies']),
        datetime: DateTimeUtils.toTimezone(
          DateTimeUtils.fromString(
            `${data.date} ${data.hour}`,
            'YYYY-MM-DD HH:mm',
          ),
          'UTC',
        ),
        table: {
          id: table.id,
          name: `Mesa ${table.number}`,
          areaId: table.areaId,
        },
        mall: {
          id: mall.id,
          name: mall.name,
        },
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          logoUrl: restaurant.logoUrl,
        },
        client: {
          firstName: data.firstName,
          lastName: data.lastName,
          allergies: data.allergies,
          phone: data.phone,
          email: data.email,
        },
      });

      const entity = await this.repo.getReservation(id);
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

  @Post(':id/cancel')
  @ApiResponse({
    status: 200,
    schema: ReservationObject,
  })
  @ApiOperation({
    summary: 'Cancelar reservacion',
  })
  async cancel(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      await this.repo.updateReservation({
        id,
        cancelled: true,
      });

      const entity = await this.repo.getReservation(id);
      return entity;
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

  private async findReservationInfo(reservation: CustomerReservationDto) {
    const restaurant = await this.restaurantRepo.getProfileById(
      reservation.restaurantId,
    );

    const mall = await this.mallRepo.find(restaurant.address);

    //  const client = await this.userFinder.find(clientId);

    const table = await this.areaRepo.findTable(
      reservation.restaurantId,
      reservation.tableId,
    );

    if (!restaurant || !mall || /* !client ||*/ !table) {
      throw new Error('SOME_RESOURCES_NOT_FOUND');
    }

    return {
      restaurant,
      mall,
      //   client,
      table,
    };
  }
}

export async function sendReservation(
  mailer,
  emailContentParser,
  user: { email: string; firstName: string },
  reservation: { id: string },
) {
  const generateQR = async (text) => {
    try {
      return QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
    }
  };

  try {
    const image = await generateQR(JSON.stringify({ id: reservation.id }));

    await mailer.send(
      new EmailMessage({
        to: {
          email: user.email,
          name: user.firstName,
        },
        subject: 'Tu reservación',
        content: await emailContentParser.parseFromFile(
          'general/reservation-email.ejs',
          {
            content: `<table align='center' border='0' cellpadding='0' cellspacing='0' width='600'>

        <tr>
            <td bgcolor='#ffffff' style='padding: 40px 30px;'>
                <h1 style='color: #333333;'>Confirmación de Reservación</h1>
                <p style='color: #333333;'>¡Hola ${user.firstName}!</p>
                <p style='color: #333333;'>Gracias por reservar con nosotros. Aquí está tu código QR de confirmación:</p>
                <div style='text-align: center;'>
                    <!-- Aquí debes proporcionar la URL o el enlace de tu imagen del código QR -->
                    <img src='cid:qr' alt='Código QR de la Reservación' width='200'>
                </div>
                <p style='color: #333333;'>Presenta este código QR al momento de tu llegada.</p>
                <p style='color: #333333;'>¡Esperamos verte pronto!</p>
            </td>
        </tr>
        <tr>
            <td bgcolor='#f0f0f0' style='padding: 30px; text-align: center;'>
                <p style='color: #666666; font-size: 12px;'>Este correo electrónico es solo para fines de confirmación. Si tienes alguna pregunta o inquietud, por favor contáctanos.</p>
                <p style='color: #666666; font-size: 12px;'>&copy; 2023 Alfred. Todos los derechos reservados.</p>
            </td>
        </tr>
    </table>`,
          },
        ),
        attachments: [
          {
            filename: 'qr.png',
            path: image,
            cid: 'qr',
          },
        ],
      }),
    );
  } catch (e) {
    console.log(e);
  }
}
