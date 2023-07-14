import AdminRoleCommandInfrastructureRepository from '@admin/auth/infrastructure/persistance/typeorm/repositories/admin-role-infrastructure-command-repository';
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
} from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import CommandBus from '@shared/domain/bus/command/command-bus';
import QueryBus from '@shared/domain/bus/query/query-bus';
import Criteria from '@shared/domain/criteria/criteria';
import Filters from '@shared/domain/criteria/filters';
import Order from '@shared/domain/criteria/order';
import { inject } from '@shared/domain/decorators';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import Collection from '@shared/domain/value-object/collection';
import ApiController from '@shared/infrastructure/controller/api-controller';
import ListDto from '@apps/shared/dto/list-dto';

class AdminRoleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  permissions: string[];
}

@ApiTags('Admin')
/* @ApiBearerAuth()
@UseGuards(JwtUserGuard) */
@Controller({
  path: 'admin/admin-roles',
})
export class AdminRolesController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('AdminRoleCommandRepository')
    private repo: AdminRoleCommandInfrastructureRepository,
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
  async list(@Query() params: ListDto): Promise<any> {
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
            filters: Filters.fromArray(where ?? {}),
          })
        : undefined;

      return await this.repo.getAll(criteria);
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

  @Get('/count')
  @ApiResponse({
    status: 200,
    description: 'Get count',
  })
  @ApiOperation({
    summary: 'Total',
  })
  async getTotal(@Query() data: any): Promise<any> {
    try {
      return {
        count: await this.repo.count(),
      };
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
      return await this.repo.get(id);
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
  async create(@Body() data: AdminRoleDto): Promise<any> {
    try {
      const newEntity = { ...data };
      await this.repo.create({
        ...newEntity,
        status: 'ACTIVE',
      });

      return newEntity;
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
  async edit(
    @Param('id') id: string,
    @Body() data: AdminRoleDto,
  ): Promise<any> {
    try {
      return await this.repo.update(id, data);
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
