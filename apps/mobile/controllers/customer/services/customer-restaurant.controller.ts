import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
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
import RestaurantInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-infrastructure-command-repository';
import RestaurantAreaInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-area-infrastructure-command-repository';
import Criteria from '@shared/domain/criteria/criteria';
import Filters from '@shared/domain/criteria/filters';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { JwtUserGuard } from '@apps/shared/infrastructure/authentication/guards/jwt-user-guard';

/*const RestaurantScheduleObject: SchemaObject = {
  type: "object",
  properties: {
    id:
  }
}*/
const RestaurantObject: SchemaObject = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    categoriesIds: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    description: {
      type: 'string',
    },
    logoUrl: {
      type: 'string',
    },
    coverImageUrl: {
      type: 'string',
    },
    slug: {
      type: 'number',
    },
    schedule: {
      type: 'object',
      properties: {},
    },
    address: {
      type: 'boolean',
    },
    contactPhone: {
      type: 'string',
    },
    areas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          tables: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                number: {
                  type: 'number',
                },
                schedule: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
      },
    },
  },
};

@ApiTags('Customer')
@ApiBearerAuth()
@UseGuards(JwtUserGuard)
@Controller({
  path: 'customer/restaurant',
})
export class CustomerRestaurantController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('RestaurantRepository')
    private repo: RestaurantInfrastructureCommandRepository,
    @inject('RestaurantAreaRepository')
    private areaRepo: RestaurantAreaInfrastructureCommandRepository,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    schema: RestaurantObject,
  })
  @ApiOperation({
    summary:
      'Recupera el perfil del restaurante con sus areas y mesas disponibles',
  })
  async get(@Param('id') id: string): Promise<any> {
    try {
      const restaurant = await this.repo.getProfileById(id);

      return restaurant
        ? {
            ...restaurant,
            areas: await this.getRestaurantAreas(restaurant.id),
          }
        : undefined;
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

  @Get(':id/areas')
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          tables: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                number: {
                  type: 'number',
                },
                schedule: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Recupera las areas y mesas disponibles de un restaurante',
  })
  async areas(@Param('id') id: string): Promise<any> {
    try {
      return this.getRestaurantAreas(id);
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

  @Get(':restaurantId/table/:id')
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        number: {
          type: 'number',
        },
        schedule: {
          type: 'object',
          properties: {},
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Recupera la informacion de una mesa de un restaurante',
  })
  async tableInfo(
    @Param('restaurantId') restaurantId: string,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      const areas = await this.getRestaurantAreas(restaurantId);
      return areas.flatMap((a) => a.tables).find((t) => t.id === id);
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

  @Get('availability/:id/:date/:tableId')
  @ApiResponse({
    status: 200,
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
  })
  async getAvailability(
    @Param('id') id: string,
    @Param('tableId') tableId: string,
    @Param('date') date: string,
  ): Promise<any> {
    try {
      const ava = await this.repo.getDayAvailability(id, date);
      console.log(ava);
      return ava.find((a) => a.id === tableId);
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

  private async getRestaurantAreas(id: string): Promise<any> {
    return this.areaRepo.findAreas(
      new Criteria({
        order: undefined,
        filters: Filters.fromArray([
          {
            field: 'restaurantId',
            operator: '==',
            value: id,
          },
        ]),
      }),
    );
  }
}
