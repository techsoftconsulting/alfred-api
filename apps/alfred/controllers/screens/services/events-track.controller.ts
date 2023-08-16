import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import CommandBus from '@shared/domain/bus/command/command-bus';
import QueryBus from '@shared/domain/bus/query/query-bus';
import { inject } from '@shared/domain/decorators';
import MultipartHandler from '@shared/domain/storage/multipart-handler';
import ApiController from '@shared/infrastructure/controller/api-controller';
import ScreensEventsInfrastructureCommandRepository from '@screens/auth/infrastructure/persistance/typeorm/repositories/screens-events-infrastructure-command-repository';

class TrackEventDto {}

@ApiTags('Screens')
@Controller({
  path: 'screens/event-track',
})
export class EventsTrackController extends ApiController {
  constructor(
    @inject('command.bus')
    commandBus: CommandBus,
    @inject('query.bus')
    queryBus: QueryBus,
    @inject('ScreenEventsRepository')
    private repo: ScreensEventsInfrastructureCommandRepository,
    @inject('multipart.handler')
    multipartHandler: MultipartHandler<Request, Response>,
  ) {
    super(commandBus, queryBus, multipartHandler);
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Track Event',
  })
  @ApiOperation({
    summary: 'Track Event',
  })
  async trackEvent(@Body() data: TrackEventDto): Promise<any> {
    try {
      await this.repo.track(data as any);

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
