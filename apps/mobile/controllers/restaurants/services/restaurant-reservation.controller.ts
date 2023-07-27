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
import ListDto from '@apps/shared/dto/list-dto';
import RestaurantInfrastructureCommandRepository from '@restaurants/auth/infrastructure/persistance/typeorm/repositories/restaurant-infrastructure-command-repository';
import { sendReservation } from '@apps/mobile/controllers/customer/services/customer-reservation.controller';
import EmailSender from '@shared/domain/email/email-sender';
import EmailContentParser from '@shared/domain/email/email-content-parser';

class RestaurantReservationDto {}

@ApiTags('Restaurant')
@ApiBearerAuth()
@UseGuards(JwtUserGuard)
@Controller({
  path: 'restaurant/reservation',
})
export class RestaurantReservationController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('RestaurantReservationRepository')
    private repo: RestaurantReservationInfrastructureCommandRepository,
    @inject('RestaurantRepository')
    private baseRestaurantRepo: RestaurantInfrastructureCommandRepository,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
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
                  field: 'restaurantId',
                  value: user.metadata.restaurantId,
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
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
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
    description: 'Create',
  })
  @ApiOperation({
    summary: 'Create',
  })
  async create(@Body() data: RestaurantReservationDto): Promise<any> {
    try {
      await this.repo.createReservation(data);

      if ((data as any).client) {
        await sendReservation(
          this.mailer,
          this.emailContentParser,
          {
            firstName: (data as any).client.firstName,
            email: (data as any).client.email,
          },
          { id: (data as any).id },
        );
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

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Update',
  })
  @ApiOperation({
    summary: 'Update',
  })
  async update(@Body() data: RestaurantReservationDto): Promise<any> {
    try {
      await this.repo.updateReservation(data);

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

  @Get('availability/:id/:date')
  @ApiResponse({
    status: 200,
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
  })
  async getAvailability(
    @Param('id') id: string,
    @Param('date') date: string,
  ): Promise<any> {
    try {
      return await this.baseRestaurantRepo.getDayAvailability(id, date);
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
