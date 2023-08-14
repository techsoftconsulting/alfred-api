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
import RestaurantReservationInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-reservation-infrastructure-command-repository';
import CustomerAccountsRepository from '../../../../../src/main/customer/auth/domain/repositories/customer-accounts-repository';
import RestaurantMallInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-mall-infrastructure-command-repository';
import RestaurantInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-infrastructure-command-repository';
import RestaurantAreaInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-area-infrastructure-command-repository';
import { ObjectUtils } from '@shared/domain/utils';

@ApiTags('Customer')
@Controller({
  path: 'customer/account',
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
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Get('/:email')
  @ApiResponse({
    status: 200,
  })
  @ApiOperation({
    summary: 'Obtiene el perfil de un usuario si está registrado',
  })
  async profile(@Param('email') email: string): Promise<any> {
    try {
      const result = await this.userFinder.findByEmail(email);
      return result
        ? ObjectUtils.pick(result, ['id', 'firstName', 'lastName', 'email'])
        : null;
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
