import { JwtUserGuard } from '@apps/shared/infrastructure/authentication/guards/jwt-user-guard';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
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
import VendorInfrastructureCommandRepository from '../../../../../src/main/vendor/auth/infrastructure/persistance/typeorm/repositories/vendor-infrastructure-command-repository';

class RestaurantDto {}

@ApiTags('Vendor')
@Controller({
  path: 'vendor/profile',
})
export class VendorController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('VendorRepository')
    private repo: VendorInfrastructureCommandRepository,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
  ) {
    super(commandBus, queryBus, multipartHandler);
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
      return await this.repo.getProfileById(id);
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

  @Get('/slug/:slug')
  @ApiResponse({
    status: 200,
    description: 'Get',
  })
  @ApiOperation({
    summary: 'Get',
  })
  async getBySlug(@Param('slug') slug: string): Promise<any> {
    try {
      console.log(slug);
      return await this.repo.getProfileBySlug(slug);
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

  @Get('/categories')
  @ApiResponse({
    status: 200,
    description: 'Get categories',
  })
  @ApiOperation({
    summary: 'Get categories',
  })
  async getCategories(): Promise<any> {
    try {
      return await this.repo.findCategories();
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
  @ApiBearerAuth()
  @UseGuards(JwtUserGuard)
  async save(@Body() data: RestaurantDto): Promise<any> {
    try {
      await this.repo.update(data);

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
