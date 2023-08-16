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
import SimpleCodeGenerator from '@shared/infrastructure/utils/simple-code-generator';
import ListDto from '@apps/shared/dto/list-dto';
import {
  sendReservation,
  sendWhatsapp,
} from '@apps/alfred/controllers/customer/services/customer-reservation.controller';
import EmailSender from '@shared/domain/email/email-sender';
import EmailContentParser from '@shared/domain/email/email-content-parser';

class HostReservationDto {
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

  @ApiProperty({
    required: false,
  })
  checkedIn?: boolean;

  @ApiProperty({
    required: false,
  })
  checkedInAt?: string;
}

@ApiTags('Host')
@ApiBearerAuth()
@UseGuards(JwtUserGuard)
@Controller({
  path: 'host/reservation',
})
export class RestaurantHostReservationController extends ApiController {
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
  })
  @ApiOperation({
    summary: 'Crear reservacion',
  })
  async create(
    @User() user: AuthenticatedUser,
    @Body() data: HostReservationDto,
  ): Promise<any> {
    try {
      const newReserv = await this.repo.createReservation(data);

      if ((data as any).client) {
        await sendWhatsapp(newReserv);

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
  })
  @ApiOperation({
    summary: 'Actualizar reservacion',
  })
  async update(
    @User() user: AuthenticatedUser,
    @Body() data: HostReservationDto,
    @Param('id') id: string,
  ): Promise<any> {
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

  @Patch(':id/cancel')
  @ApiResponse({
    status: 200,
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
      return await this.restaurantRepo.getDayAvailability(id, date);
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
