import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CommandBus from '@shared/domain/bus/command/command-bus';
import QueryBus from '@shared/domain/bus/query/query-bus';
import { inject } from '@shared/domain/decorators';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import ApiController from '@shared/infrastructure/controller/api-controller';
import RestaurantInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-infrastructure-command-repository';
import RestaurantAreaInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-area-infrastructure-command-repository';
import Criteria from '@shared/domain/criteria/criteria';
import Filters from '@shared/domain/criteria/filters';

@ApiTags('Host')
@Controller({
  path: 'host/restaurant',
})
export class RestaurantHostRestaurantController extends ApiController {
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
