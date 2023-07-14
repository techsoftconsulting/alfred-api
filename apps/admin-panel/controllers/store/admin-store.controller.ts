import { JwtUserGuard } from '@apps/shared/infrastructure/authentication/guards/jwt-user-guard';
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
import AdminRestaurantInfrastructureCommandRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/restaurants/admin-restaurant-infrastructure-command-repository';
import { User } from '@apps/shared/decorators/user-decorator';
import AuthenticatedUser from '@apps/shared/dto/authenticated-user';
import Criteria from '@shared/domain/criteria/criteria';
import Collection from '@shared/domain/value-object/collection';
import Order from '@shared/domain/criteria/order';
import Filters from '@shared/domain/criteria/filters';
import ListDto from '@apps/shared/dto/list-dto';

class AdminStoreDto {
  /*  @ApiProperty()
      id: string;
    
      @ApiProperty()
      name: string;
    
      @ApiProperty()
      categoriesIds: string[];
    
      @ApiProperty()
      description: string;
    
      @ApiProperty()
      logoUrl?: string;
    
      @ApiProperty()
      coverImageUrl?: string;
    
      @ApiProperty()
      slug: string;
    
      @ApiProperty()
      schedule: any;
    
      @ApiProperty()
      address: string;
    
      @ApiProperty()
      contactPhone: string;
    
      @ApiProperty()
      status: string;
    
      @ApiProperty()
      createdAt: string;
    
      @ApiProperty()
      recommended: boolean;
    
      @ApiProperty()
      available: boolean;
    
      @ApiProperty()
      type: string;*/
}

class AdminGuardSlugRestaurantDto {
  @ApiProperty()
  slug: string;

  @ApiProperty()
  id: string;
}

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtUserGuard)
@Controller({
  path: 'admin/stores',
})
export class AdminStoreController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('AdminRestaurantRepository')
    private repo: AdminRestaurantInfrastructureCommandRepository,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
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
            filters: Filters.fromArray([...where]),
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

  @Post('guard-unique-slug')
  @ApiResponse({
    status: 200,
    description: 'guardUniqueSlug',
  })
  @ApiOperation({
    summary: 'guardUniqueSlug',
  })
  async guardUniqueSlug(
    @Body() data: AdminGuardSlugRestaurantDto,
  ): Promise<any> {
    try {
      return await this.repo.guardUniqueSlug(data.slug, data.id);
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
  async save(@Body() data: AdminStoreDto): Promise<any> {
    try {
      await this.repo.save(data);

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
