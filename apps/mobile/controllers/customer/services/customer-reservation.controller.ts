import { JwtUserGuard } from '@apps/shared/infrastructure/authentication/guards/jwt-user-guard';
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

class CustomerReservationDto {
  @ApiProperty()
  restaurantId: string;

  @ApiProperty()
  tableId: string;

  @ApiProperty({
    required: false,
  })
  allergies?: string;

  @ApiProperty({
    required: false,
  })
  phone?: string;

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
@ApiBearerAuth()
@UseGuards(JwtUserGuard)
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
  async create(
    @User() user: AuthenticatedUser,
    @Body() data: CustomerReservationDto,
  ): Promise<any> {
    try {
      const { mall, client, table, restaurant } =
        await this.findReservationInfo(user.id, data);
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
          id: client.id,
          firstName: client.firstName,
          lastName: client.firstName,
          allergies: data.allergies ?? client.allergies,
          phone: data.phone ?? client.phone,
          email: client.email,
        },
        status: 'ACTIVE',
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

  @Patch(':id')
  @ApiResponse({
    status: 200,
    schema: ReservationObject,
  })
  @ApiOperation({
    summary: 'Actualizar reservacion',
  })
  async update(
    @User() user: AuthenticatedUser,
    @Body() data: CustomerReservationDto,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      const { mall, client, table, restaurant } =
        await this.findReservationInfo(user.id, data);
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
          id: client.id,
          firstName: client.firstName,
          lastName: client.firstName,
          allergies: data.allergies ?? client.allergies,
          phone: data.phone ?? client.phone,
          email: client.email,
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

  @Patch(':id/cancel')
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

  /*
                                              
                                                @Delete(':id')
                                                @ApiResponse({
                                                  status: 200,
                                                  description: 'delete',
                                                })
                                                @ApiOperation({
                                                  summary: 'Eliminar reservacion',
                                                })
                                                async delete(@Param('id') id: string): Promise<any> {
                                                  try {
                                                    await this.repo.deleteReservation(id);
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
                                              */

  private async findReservationInfo(
    clientId: string,
    reservation: CustomerReservationDto,
  ) {
    const restaurant = await this.restaurantRepo.getProfileById(
      reservation.restaurantId,
    );

    const mall = await this.mallRepo.find(restaurant.address);

    const client = await this.userFinder.find(clientId);

    const table = await this.areaRepo.findTable(
      reservation.restaurantId,
      reservation.tableId,
    );

    if (!restaurant || !mall || !client || !table) {
      throw new Error('SOME_RESOURCES_NOT_FOUND');
    }

    return {
      restaurant,
      mall,
      client,
      table,
    };
  }
}
