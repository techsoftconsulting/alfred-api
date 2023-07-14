import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import AdminStatsInfrastructureCommandRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/stats/admin-stats-infrastructure-command-repository';
import Criteria from '@shared/domain/criteria/criteria';
import Filters from '@shared/domain/criteria/filters';
import ListDto from '@apps/shared/dto/list-dto';
import { JwtUserGuard } from '@apps/shared/infrastructure/authentication/guards/jwt-user-guard';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtUserGuard)
@Controller({
  path: 'admin/stats',
})
export class AdminStatsController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('AdminStatsRepository')
    private repo: AdminStatsInfrastructureCommandRepository,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Get('/most-searched-malls')
  @ApiResponse({
    status: 200,
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
  })
  async mostSearchedMalls(@Query() params): Promise<any> {
    const order = params['filter[order]']
      ? JSON.stringify(params['filter[order]'])
      : undefined;
    const limit = params['filter[limit]'];
    const skip = params['filter[skip]'];
    const where = JSON.parse(params['filter[where]'] ?? '{}');

    try {
      return await this.repo.mostSearchedMalls(
        new Criteria({
          order: undefined,
          filters: Filters.fromValues(where),
        }),
      );
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

  @Get('/most-searched-restaurants')
  @ApiResponse({
    status: 200,
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
  })
  async mostSearchedRestaurants(@Query() params): Promise<any> {
    const order = params['filter[order]']
      ? JSON.stringify(params['filter[order]'])
      : undefined;
    const limit = params['filter[limit]'];
    const skip = params['filter[skip]'];
    const where = JSON.parse(params['filter[where]'] ?? '{}');
    try {
      return await this.repo.mostSearchedRestaurants(
        new Criteria({
          order: undefined,
          filters: Filters.fromValues(where),
        }),
      );
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

  @Get('/most-visited-malls')
  @ApiResponse({
    status: 200,
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
  })
  async mostVisitedMalls(@Query() params): Promise<any> {
    const order = params['filter[order]']
      ? JSON.stringify(params['filter[order]'])
      : undefined;
    const limit = params['filter[limit]'];
    const skip = params['filter[skip]'];
    const where = JSON.parse(params['filter[where]'] ?? '{}');
    try {
      return await this.repo.mostVisitedMalls(
        new Criteria({
          order: undefined,
          filters: Filters.fromValues(where),
        }),
      );
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

  @Get('/most-visited-restaurants')
  @ApiResponse({
    status: 200,
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
  })
  async mostVisitedRestaurants(@Query() params): Promise<any> {
    const order = params['filter[order]']
      ? JSON.stringify(params['filter[order]'])
      : undefined;
    const limit = params['filter[limit]'];
    const skip = params['filter[skip]'];
    const where = JSON.parse(params['filter[where]'] ?? '{}');
    try {
      return await this.repo.mostVisitedRestaurants(
        new Criteria({
          order: undefined,
          filters: Filters.fromValues(where),
        }),
      );
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

  @Get('/most-visited-promotions')
  @ApiResponse({
    status: 200,
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
  })
  async mostVisitedPromotions(@Query() params): Promise<any> {
    const order = params['filter[order]']
      ? JSON.stringify(params['filter[order]'])
      : undefined;
    const limit = params['filter[limit]'];
    const skip = params['filter[skip]'];
    const where = JSON.parse(params['filter[where]'] ?? '{}');
    try {
      return await this.repo.mostVisitedPromotions(
        new Criteria({
          order: undefined,
          filters: Filters.fromValues(where),
        }),
      );
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

  @Get('/most-reserved-restaurants')
  @ApiResponse({
    status: 200,
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
  })
  async restaurantWithMoreReservations(@Query() params: ListDto): Promise<any> {
    const order = params['filter[order]']
      ? JSON.stringify(params['filter[order]'])
      : undefined;
    const limit = params['filter[limit]'];
    const skip = params['filter[skip]'];
    const where = JSON.parse(params['filter[where]'] ?? '{}');
    try {
      return await this.repo.restaurantWithMoreReservations(
        new Criteria({
          order: undefined,
          filters: Filters.fromValues(where),
        }),
      );
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
